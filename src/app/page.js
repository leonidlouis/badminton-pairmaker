"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  Grid,
  TextField,
  Typography,
  Divider,
  Box,
  Button,
  Table,
  TableRow,
  TableBody,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import {
  IconArrowsShuffle,
  IconBrandGithub,
  IconBrandLinkedin,
  IconChecks,
  IconMinus,
  IconPlus,
  IconRefresh,
  IconRestore,
  IconSettings,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";

import { useSessionContext } from "./context/SessionContext";

import Title from "@/components/Title";
import BigSwitch from "@/components/BigSwitch";
import IconButton from "@/components/IconButton";
import BorderedTableCell from "@/components/BorderedTableCell";

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

  const handleGameModeChange = (newValue) => {
    setSession((prevSession) => ({
      ...prevSession,
      isDouble: newValue,
    }));
  };

  const handleCourtCountChange = (newValue) => {
    if (newValue <= 0) return;

    setSession((prevSession) => ({
      ...prevSession,
      courtCount: newValue,
    }));
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

  const decrementPlayCount = (index) => {
    const newPlayers = [...session.players];
    let playedCount = Number(newPlayers[index].played);
    if (isNaN(playedCount)) {
      playedCount = 0;
    } else if (playedCount > 0) {
      playedCount -= 1;
    }
    newPlayers[index].played = playedCount;

    setSession((prevSession) => ({
      ...prevSession,
      players: newPlayers,
    }));
  };

  const incrementPlayCount = (index) => {
    const newPlayers = [...session.players];
    let playedCount = Number(newPlayers[index].played);
    if (isNaN(playedCount)) {
      playedCount = 1;
    } else {
      playedCount += 1;
    }
    newPlayers[index].played = playedCount;

    setSession((prevSession) => ({
      ...prevSession,
      players: newPlayers,
    }));
  };

  const resetPlayCount = (index) => {
    const newPlayers = [...session.players];
    newPlayers[index].played = 0;

    setSession((prevSession) => ({
      ...prevSession,
      players: newPlayers,
    }));
  };

  const shuffle = () => {
    const { players, isDouble, courtCount } = session;

    const activePlayers = players.filter((player) => player.active);
    const inactivePlayers = players.filter((player) => !player.active);

    // Use Fisher-Yates shuffle on active players
    const listOfActivePlayers = fisherYatesShuffle(activePlayers);

    const courts = [];
    const notPlaying = [];

    const playersPerTeam = isDouble ? 2 : 1;
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
    setSession({ ...session, shuffled: true });
  };

  const resetSession = () => {
    setSession({
      players: [],
      matches: [],
      courtCount: 1,
      name: "",
      isDouble: false,
      shuffled: false,
    });
    setShuffleResult({
      notPlaying: [],
      courts: [],
    });
  };

  const confirmMatchup = () => {
    const newPlayers = session.players.map((player) => {
      let playedCount = Number(player.played);
      if (isNaN(playedCount)) {
        playedCount = 0;
      }

      if (
        !shuffleResult.notPlaying.some(
          (notPlayingPlayer) => notPlayingPlayer.name === player.name
        )
      ) {
        playedCount += 1;
      }
      return { ...player, played: playedCount };
    });

    setSession((prevSession) => ({
      ...prevSession,
      shuffled: false,
      players: newPlayers,
    }));
  };

  const isShuffleDisabled = useMemo(() => {
    const minPlayer = session.isDouble ? 4 : 2;

    return minPlayer > session.players.length;
  }, [session]);

  //
  const [tabValue, setTabValue] = useState(0);

  const isTabActive = useCallback(
    (tab) => {
      return tab === tabValue;
    },
    [tabValue]
  );

  return (
    <Stack spacing={2}>
      <Box display={"flex"} justifyContent={"center"}>
        <Title text={"Badminton Pairmaker App"} />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant="fullWidth"
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab
            label={
              <Typography
                variant="body2"
                fontWeight={isTabActive(0) ? 600 : 400}
              >
                Shuffler
              </Typography>
            }
            icon={<IconArrowsShuffle size={16} />}
            iconPosition={"start"}
            sx={{ minHeight: 48 }}
          />
          <Tab
            label={
              <Typography
                variant="body2"
                fontWeight={isTabActive(1) ? 600 : 400}
              >
                Players
              </Typography>
            }
            icon={<IconUsers size={16} />}
            iconPosition={"start"}
            sx={{ minHeight: 48 }}
          />
          <Tab
            label={
              <Typography
                variant="body2"
                fontWeight={isTabActive(2) ? 600 : 400}
              >
                Settings
              </Typography>
            }
            icon={<IconSettings size={16} />}
            iconPosition="start"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>

      {isTabActive(0) && (
        <Stack spacing={2}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Game Mode:
            </Typography>

            <Box display={"flex"} gap={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                {session.isDouble ? "Double" : "Single"}
              </Typography>
              <BigSwitch
                checked={session.isDouble}
                onClick={() => handleGameModeChange(!session.isDouble)}
              />
            </Box>
          </Box>
          {/* <Box>
            <Grid
              container
              spacing={2}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item xs={4}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Court Count:
                </Typography>
              </Grid>
              <Grid item>
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  <IconButton
                    variant="primary"
                    onClick={() =>
                      handleCourtCountChange(session.courtCount - 1)
                    }
                  >
                    <IconMinus size={16} />
                  </IconButton>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {session.courtCount}
                  </Typography>
                  <IconButton
                    variant="primary"
                    onClick={() =>
                      handleCourtCountChange(session.courtCount + 1)
                    }
                  >
                    <IconPlus size={16} />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box> */}

          <Divider />

          <Stack spacing={1}>
            <Box>
              <Grid
                container
                spacing={1}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={shuffle}
                    disabled={isShuffleDisabled}
                    startIcon={<IconArrowsShuffle size={16} />}
                    sx={{ textTransform: "none" }}
                  >
                    <Typography variant="body2">Shuffle</Typography>
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    disabled={!session.shuffled}
                    variant="outlined"
                    color="secondary"
                    startIcon={<IconChecks size={16} />}
                    onClick={confirmMatchup}
                    sx={{ textTransform: "none" }}
                  >
                    <Typography variant="body2">Confirm Matchup</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
              {isShuffleDisabled && (
                <Typography variant="caption" color="error">
                  Please add more players & check game mode to shuffle
                </Typography>
              )}
            </Box>
          </Stack>

          {shuffleResult.courts.length > 0 &&
            shuffleResult.courts.map((court, i) => (
              <Box key={i}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <BorderedTableCell colSpan={2}>
                        <Typography variant="body2" fontWeight={600}>
                          Court {i + 1}
                        </Typography>
                      </BorderedTableCell>
                    </TableRow>
                    <TableRow>
                      {court.teamOne.map((player, i) => (
                        <BorderedTableCell key={i} sx={{ width: "50%" }}>
                          {player.name}
                        </BorderedTableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      {court.teamTwo.map((player, i) => (
                        <BorderedTableCell key={i} sx={{ width: "50%" }}>
                          {player.name}
                        </BorderedTableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            ))}

          {shuffleResult.notPlaying.length > 0 && (
            <Box>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <BorderedTableCell>
                      <Typography variant="body2" fontWeight={600}>
                        Not Playing
                      </Typography>
                    </BorderedTableCell>
                  </TableRow>
                  {shuffleResult.notPlaying.map((player, i) => (
                    <TableRow>
                      <BorderedTableCell key={i} sx={{ width: "50%" }}>
                        {player.name}
                      </BorderedTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Stack>
      )}

      {isTabActive(1) && (
        <Stack spacing={2}>
          <Box>
            <Grid
              container
              spacing={1}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid item xs={6}>
                <Button
                  fullWidth
                  startIcon={<IconPlus size={16} />}
                  variant="outlined"
                  onClick={handleAddPlayer}
                  sx={{ textTransform: "none" }}
                >
                  <Typography variant="body2">Add Player</Typography>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  startIcon={<IconRestore size={16} />}
                  variant="outlined"
                  color={"secondary"}
                  onClick={handleAddPlayer}
                  sx={{ textTransform: "none" }}
                >
                  <Typography variant="body2">Reset Play Count</Typography>
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          {session.players.map((player, index) => (
            <Grid key={index} item xs={12} sx={{ mb: 2, mt: 2 }}>
              <Stack spacing={1}>
                <TextField
                  size="small"
                  variant="outlined"
                  label={`Player ${index + 1}`}
                  value={player.name}
                  onChange={(event) => handlePlayerInputChange(index, event)}
                />

                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Grid item xs={4}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Play Count:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box display={"flex"} gap={2} alignItems={"center"}>
                      <IconButton
                        variant="primary"
                        onClick={() => decrementPlayCount(index)}
                      >
                        <IconMinus size={16} />
                      </IconButton>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {player.played}
                      </Typography>
                      <IconButton
                        variant="primary"
                        onClick={() => incrementPlayCount(index)}
                      >
                        <IconPlus size={16} />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>

                <Grid
                  container
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Grid item xs={4}>
                    <Box display={"flex"} gap={1} alignItems={"center"}>
                      <BigSwitch
                        checked={player.active}
                        onChange={() => togglePlayerActive(index)}
                        name="active"
                      />
                      <Typography variant="subtitle1" fontWeight={600}>
                        {player.active ? "Active" : "Inactive"}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box display={"flex"} gap={2}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<IconRefresh size={16} />}
                        sx={{ textTransform: "none" }}
                        onClick={() => resetPlayCount(index)}
                      >
                        Reset
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<IconTrash size={16} />}
                        sx={{ textTransform: "none" }}
                        onClick={() => handleRemovePlayer(index)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Grid>
                </Grid>

                <Divider />
              </Stack>
            </Grid>
          ))}
        </Stack>
      )}

      {isTabActive(2) && (
        <Stack spacing={2}>
          <Button
            variant="outlined"
            onClick={resetSession}
            color="error"
            startIcon={<IconTrash size={16} />}
            sx={{ textTransform: "none" }}
          >
            <Typography variant="body2">Reset All Settings</Typography>
          </Button>

          <Stack>
            <Typography variant="subtitle2">
              Data is saved between sessions.
            </Typography>
            <Typography variant="subtitle2">
              Leaving or reloading the page will not affect the data.
            </Typography>
            <Typography variant="subtitle2">
              Reset All Settings will entirely remove all players data.
            </Typography>
          </Stack>

          <Divider />

          <Stack>
            <Typography variant="subtitle2" fontWeight={600}>
              Source Code
            </Typography>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Link
                    href="https://github.com/leonidlouis/badminton-pairmaker"
                    target="_blank"
                  >
                    <Box display={"flex"} gap={1}>
                      <IconBrandGithub color="black" />
                      <Typography variant="subtitle2">GitHub</Typography>
                    </Box>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Stack>

          <Stack>
            <Typography variant="subtitle2" fontWeight={600}>
              Contributors
            </Typography>
            <Box>
              <Grid container spacing={2} fontWeight={600}>
                <Grid item xs={6}>
                  <Link
                    href="https://www.linkedin.com/in/leonidlouis"
                    target="_blank"
                  >
                    <Box display={"flex"} gap={1}>
                      <IconBrandLinkedin color="black" />
                      <Typography variant="subtitle2">Louis Leonid</Typography>
                    </Box>
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Link
                    href="https://www.linkedin.com/in/vilbert"
                    target="_blank"
                  >
                    <Box display={"flex"} gap={1}>
                      <IconBrandLinkedin color="black" />
                      <Typography variant="subtitle2">
                        Vilbert Gunawan
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
