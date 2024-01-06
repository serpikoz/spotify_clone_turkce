"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongsUrl";
import useLoadSong from "@/hooks/useLoadSongsUrl";

import usePlayer from "@/hooks/usePlayer";

const Player = () => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);

  const songUrl = useLoadSongUrl(song!);

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 bg-black w-full h-[80px] px-4">Player</div>
  );
};

export default Player;
