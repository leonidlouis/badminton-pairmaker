"use client";
import { useEffect, useMemo, useState } from "react";
import { useSessionContext } from "./context/SessionContext";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  TextField,
  Typography,
  Divider,
  Box,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { POSSIBLE_GAME_MODE_OPTIONS } from "./constant";
import Link from "next/link";

export default function Home() {
  const { session, setSession } = useSessionContext();

  const [shuffleResult, setShuffleResult] = useState({
    notPlaying: [],
    courts: [],
  });

  const handleGameModeChange = (event) => {
    setSession((prevSession) => ({
      ...prevSession,
      gameMode: event.target.value,
    }));
  };

  const handleCourtCountChange = (event) => {
    setSession((prevSession) => ({
      ...prevSession,
      courtCount: event.target.value,
    }));
  };

  const handlePlayerInputChange = (index, event) => {
    const values = [...session.players];
    values[index] = event.target.value;
    setSession((prevSession) => ({
      ...prevSession,
      players: values,
    }));
  };

  const handleAddPlayer = () => {
    setSession((prevSession) => ({
      ...prevSession,
      players: [
        ...prevSession.players,
        (prevSession.players.length + 1).toString(),
      ],
    }));
  };

  const handleRemovePlayer = (index) => {
    const values = [...session.players];
    values.splice(index, 1);
    setSession((prevSession) => ({
      ...prevSession,
      players: values,
    }));
  };

  console.log(shuffleResult);

  const shuffle = () => {
    const { players, gameMode, courtCount } = session;
    const listOfPlayers = [...players].sort(() => Math.random() - 0.5);

    const courts = [];
    const notPlaying = [];

    const playersPerTeam = gameMode === "DOUBLE" ? 2 : 1;
    let remainingPlayers = players.length;

    for (let i = 0; i < listOfPlayers.length; i += playersPerTeam * 2) {
      if (remainingPlayers < playersPerTeam * 2) {
        notPlaying.push(...listOfPlayers.slice(i));
        break;
      }
      const teamOne = listOfPlayers.slice(i, i + playersPerTeam);
      const teamTwo = listOfPlayers.slice(
        i + playersPerTeam,
        i + playersPerTeam * 2
      );
      courts.push({
        courtNumber: `${courts.length + 1}${
          courts.length + 1 > courtCount ? " (play later)" : ""
        }`,
        teamOne: teamOne,
        teamTwo: teamTwo,
      });
      remainingPlayers -= playersPerTeam * 2;
    }

    setShuffleResult({ courts, notPlaying });
  };

  const resetSession = () => {
    setSession({
      players: [],
      matches: [],
      courtCount: 1,
      gameMode: "",
      name: "",
    });
    setShuffleResult({
      notPlaying: [],
      courts: [],
    });
  };

  const isShuffleDisabled = useMemo(() => {
    if (!session.gameMode) {
      return true;
    }

    const minPlayer = session.gameMode == "DOUBLE" ? 4 : 2;
    console.log(session.gameMode, minPlayer, session.players.length);

    if (minPlayer > session.players.length) {
      return true;
    }

    return false;
  }, [session]);

  return (
    <main>
      <Grid container spacing={3}>
        {/* SESSION INFORMATION SECTION */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="bold">
            Badminton Pairing Randomizer
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            startIcon={<DeleteForeverIcon />}
            variant="outlined"
            onClick={resetSession}
            color="error"
          >
            <Typography>RESET(DELETE) ALL DATA</Typography>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-outlined-label">
              Game Mode
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={session.gameMode}
              onChange={handleGameModeChange}
              label="Game Mode"
            >
              {POSSIBLE_GAME_MODE_OPTIONS.map((val, key) => (
                <MenuItem key={key} value={val.value}>
                  {val.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Court count (ada berapa lapangan)"
            value={session.courtCount}
            onChange={handleCourtCountChange}
            type="number"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ border: "1px solid black" }} />
        </Grid>

        {/* PLAYER LIST SECTION */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="bold">
            Player List
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="outlined"
            onClick={handleAddPlayer}
          >
            <Typography>Add Player</Typography>
          </Button>
        </Grid>

        <Grid item xs={12}>
          {session.players.map((player, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              marginBottom={2}
            >
              <TextField
                variant="outlined"
                label={`Player ${index + 1}`}
                value={player}
                onChange={(event) => handlePlayerInputChange(index, event)}
              />

              <Button
                startIcon={<RemoveCircleOutlineIcon />}
                onClick={() => handleRemovePlayer(index)}
                color="error"
              >
                <Typography>Delete</Typography>
              </Button>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ border: "1px solid black" }} />
        </Grid>

        {/* PLAYER LIST SECTION */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="bold">
            Match Pairing
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Button
            startIcon={<ShuffleIcon />}
            variant="outlined"
            onClick={shuffle}
            disabled={isShuffleDisabled}
          >
            <Typography>Shuffle</Typography>
          </Button>
          {isShuffleDisabled
            ? " add more players & check game mode to shuffle"
            : ""}
        </Grid>

        {shuffleResult.courts.length > 0 ? (
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography>Court Number</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>Team 1</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>Team 2</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shuffleResult.courts.map((court, index) => (
                    <TableRow key={index}>
                      <TableCell>{court.courtNumber}</TableCell>
                      <TableCell>
                        {court.teamOne[0]}
                        {session.gameMode === "DOUBLE"
                          ? ` & ${court.teamOne[1]}`
                          : ""}
                      </TableCell>
                      <TableCell>
                        {court.teamTwo[0]}
                        {session.gameMode === "DOUBLE"
                          ? ` & ${court.teamTwo[1]}`
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ) : null}

        {shuffleResult.notPlaying.length > 0 ? (
          <Grid item xs={12}>
            <Typography>Not Playing</Typography>
            <Box>
              <List component="nav">
                {shuffleResult.notPlaying.map((name, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${index + 1}. ${name}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        ) : null}

        <Grid item xs={12}>
          <Divider sx={{ border: "1px solid black" }} />
        </Grid>
        <Grid item xs={12}>
          <Typography>
            source code is here:&nbsp;
            <Link
              href="https://github.com/leonidlouis/badminton-pairmaker"
              target="_blank"
            >
              https://github.com/leonidlouis/badminton-pairmaker
            </Link>
          </Typography>
          <Typography>
            connect with me here:&nbsp;
            <Link
              href="https://www.linkedin.com/in/leonidlouis/"
              target="_blank"
            >
              https://www.linkedin.com/in/leonidlouis/
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </main>
  );
}
