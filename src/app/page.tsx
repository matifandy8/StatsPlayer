"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import InputSearchPlayer from "./ui/inputSearchPlayer/inputSearchPlayer";
import { teamBackgroundColors } from "./lib/themes";
import { fetchPlayers } from "./lib/fetch";
import ListPlayers from "./ui/home/listPlayers";
import Loading from "./ui/loading/loading";

export default function Home() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<any>([]);
  const [selectedTeam, setSelectedTeam] = useState("default");
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    fetchPlayers()
      .then((data) => {
        setPlayers(data);
      })
      .catch((error) => {
        console.error("Error fetching players:", error);
        setError("Error to found players. Please try again later.");
      });
  }, []);
  const searchPlayer = (playerName: string) => {
    let filteredPlayers;

    setLoading(true);
    const searchTerm = playerName.toLowerCase().trim();
    if (searchTerm === "") {
      setSearchResults([]);
      setSearchPerformed(false);
      setLoading(false);
      return;
    }
    setSearchPerformed(true);
    if (!searchTerm) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setTimeout(() => {
      filteredPlayers = players.filter((player: any) => {
        return (
          player.firstname.toLowerCase().includes(searchTerm) ||
          player.lastname.toLowerCase().includes(searchTerm)
        );
      });
      setLoading(false);
      setSearchResults(filteredPlayers);
    }, 500);
  };

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: teamBackgroundColors[selectedTeam] }}
    >
      <h1 className={styles.title}>Search your NBA player here</h1>
      <InputSearchPlayer
        selectedTeam={setSelectedTeam}
        onSearch={searchPlayer}
      />
      {error && <p>{error}</p>}
      {loading ? (
        <Loading />
      ) : searchPerformed && searchResults.length === 0 ? (
        <p>No players found</p>
      ) : (
        searchPerformed && <ListPlayers data={searchResults} />
      )}
    </main>
  );
}
