"use client";
import { useMemo, Fragment } from "react";
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
  Switch,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { POSSIBLE_GAME_MODE_OPTIONS } from "./constant";
import Link from "next/link";

export default function Home() {
  const { session, setSession, shuffleResult, setShuffleResult } =
    useSessionContext();

  // FISHER-YATES
  const fisherYatesShuffle = (array) => {
    let arrayCopy = [...array];
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }
    return arrayCopy;
  };

  // for simulation purposes
  // useEffect(() => {
  //   const simulateMatchups = () => {
  //     // Initialize with 10 new players and matchups tracking
  //     const simulatedPlayers = Array.from({ length: 10 }, (_, index) => ({
  //       name: `Player ${index + 1}`,
  //       played: 0,
  //       matchups: {},
  //     }));

  //     for (let i = 0; i < 10000; i++) {
  //       const shuffledPlayers = fisherYatesShuffle(simulatedPlayers); // ~3.5% deviation
  //       // const shuffledPlayers = simulatedPlayers.sort(
  //       //   () => Math.random() - 0.5
  //       // );

  //       const playing = shuffledPlayers.slice(0, 8); // Assume top 8 are playing this round

  //       // Update played count and matchups
  //       playing.forEach((player, idx) => {
  //         player.played += 1;
  //         for (let j = 0; j < playing.length; j++) {
  //           if (idx !== j) {
  //             // Don't match a player with themselves
  //             player.matchups[playing[j].name] =
  //               (player.matchups[playing[j].name] || 0) + 1;
  //           }
  //         }
  //       });
  //     }

  //     // Calculate the highest, lowest, deviation, and percentage deviation of matchups for each player
  //     simulatedPlayers.forEach((player) => {
  //       const matchupsValues = Object.values(player.matchups);
  //       const maxMatchups = Math.max(0, ...matchupsValues); // Avoid -Infinity for players with no matchups
  //       const minMatchups = Math.min(
  //         ...(matchupsValues.length ? matchupsValues : [0])
  //       ); // Avoid Infinity and ensure at least 0
  //       const deviation = maxMatchups - minMatchups;
  //       const deviationPercentage =
  //         (deviation / ((maxMatchups + minMatchups) / 2)) * 100;
  //       console.log(`${player.name} matchups: `, player.matchups);
  //       console.log(
  //         `${
  //           player.name
  //         } Max matchups: ${maxMatchups}, Min matchups: ${minMatchups}, Deviation: ${deviation}, Deviation Percentage: ${deviationPercentage.toFixed(
  //           2
  //         )}%`
  //       );
  //     });

  //     let globalMax = 0;
  //     let globalMin = Infinity;
  //     simulatedPlayers.forEach((player) => {
  //       Object.values(player.matchups).forEach((count) => {
  //         if (count > globalMax) globalMax = count;
  //         if (count < globalMin) globalMin = count;
  //       });
  //     });
  //     const globalDeviation = globalMax - globalMin;
  //     const globalDeviationPercentage =
  //       (globalDeviation / ((globalMax + globalMin) / 2)) * 100;
  //     console.log(
  //       `Global Max matchups: ${globalMax}, Global Min matchups: ${globalMin}, Global Deviation: ${globalDeviation}, Global Deviation Percentage: ${globalDeviationPercentage.toFixed(
  //         2
  //       )}%`
  //     );
  //   };

  //   const timer = setTimeout(() => {
  //     simulateMatchups();
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, []);

  const handleGameModeChange = (event) => {
    setSession((prevSession) => ({
      ...prevSession,
      gameMode: event.target.value,
    }));
  };

  const handleCourtCountChange = (event) => {
    const regex = /^[0-9\b]+$/;
    if (event.target.value === "" || regex.test(event.target.value)) {
      setSession((prevSession) => ({
        ...prevSession,
        courtCount: event.target.value,
      }));
    }
  };

  const handlePlayerInputChange = (index, event) => {
    const newPlayers = [...session.players];
    newPlayers[index] = { ...newPlayers[index], name: event.target.value };
    setSession((prevSession) => ({
      ...prevSession,
      players: newPlayers,
    }));
  };

  const handleAddPlayer = () => {
    setSession((prevSession) => ({
      ...prevSession,
      players: [
        ...prevSession.players,
        {
          name: (prevSession.players.length + 1).toString(),
          played: 0,
          active: true,
        },
      ],
    }));
  };

  const togglePlayerActive = (index) => {
    const newPlayers = [...session.players];
    newPlayers[index].active = !newPlayers[index].active;
    setSession((prevSession) => ({
      ...prevSession,
      players: newPlayers,
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

  const shuffle = () => {
    const { players, gameMode, courtCount } = session;

    const activePlayers = players.filter((player) => player.active);
    const inactivePlayers = players.filter((player) => !player.active);

    // Use Fisher-Yates shuffle on active players
    const listOfActivePlayers = fisherYatesShuffle(activePlayers);

    const courts = [];
    const notPlaying = [];

    const playersPerTeam = gameMode === "DOUBLE" ? 2 : 1;
    let remainingPlayers = listOfActivePlayers.length;

    for (let i = 0; i < listOfActivePlayers.length; i += playersPerTeam * 2) {
      if (remainingPlayers < playersPerTeam * 2) {
        notPlaying.push(...listOfActivePlayers.slice(i));
        break;
      }
      const teamOne = listOfActivePlayers.slice(i, i + playersPerTeam);
      const teamTwo = listOfActivePlayers.slice(
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

    // Append all inactive players to notPlaying at the end
    notPlaying.push(...inactivePlayers);

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

  const confirmMatchup = () => {
    const newPlayers = session.players.map((player) => {
      if (
        !shuffleResult.notPlaying.some(
          (notPlayingPlayer) => notPlayingPlayer.name === player.name
        )
      ) {
        return { ...player, played: player.played + 1 };
      }
      return player;
    });

    setSession((prevSession) => ({
      ...prevSession,
      players: newPlayers,
    }));
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
                value={player.name}
                onChange={(event) => handlePlayerInputChange(index, event)}
              />
              <Typography variant="body1" marginLeft={2}>
                Play Count: {player.played}
              </Typography>

              <Button
                startIcon={<RemoveCircleOutlineIcon />}
                onClick={() => handleRemovePlayer(index)}
                color="error"
              >
                <Typography>Delete</Typography>
              </Button>
              <Switch
                checked={player.active}
                onChange={() => togglePlayerActive(index)}
                name="active"
                inputProps={{ "aria-label": "secondary checkbox" }}
              />
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
                        {court.teamOne.map((player, idx) => (
                          <Fragment key={idx}>
                            {idx > 0 ? " & " : ""}
                            {player.name}
                          </Fragment>
                        ))}
                      </TableCell>
                      <TableCell>
                        {court.teamTwo.map((player, idx) => (
                          <Fragment key={idx}>
                            {idx > 0 ? " & " : ""}
                            {player.name}
                          </Fragment>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ) : null}
        {shuffleResult.courts.length > 0 && (
          <Grid item xs={12}>
            <Button variant="outlined" color="primary" onClick={confirmMatchup}>
              <Typography>Confirm Above Matchup</Typography>
            </Button>{" "}
            <Typography variant="subtitle2">
              *Will increment Play Count
            </Typography>
          </Grid>
        )}

        {shuffleResult.notPlaying.length > 0 ? (
          <Grid item xs={12}>
            <Typography>Not Playing</Typography>
            <Box>
              <List component="nav">
                {shuffleResult.notPlaying.map((player, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${index + 1}. ${player.name}`} />
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
          <Typography variant="subtitle2">
            p.s. data is <b>saved between sessions</b>, so you can reload /
            access the page at anytime & what you've filled will still be there
            :)
          </Typography>
          <Typography variant="subtitle2">
            source code is here:&nbsp;
            <Link
              href="https://github.com/leonidlouis/badminton-pairmaker"
              target="_blank"
            >
              https://github.com/leonidlouis/badminton-pairmaker
            </Link>
          </Typography>
          <Typography variant="subtitle2">
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
