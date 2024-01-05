"use client";

import MediaItem from "@/components/MediaItem";
import { Song } from "@/types";

interface SearchContentProps {
  songs: Song[];
}

//Aramada eşleşme olmazsa şarkı bulunamadı... yazısı gelir.Ve arama eşleşmesi sağlar

const SearchContent = ({ songs }: SearchContentProps) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
        Şarkı Bulunamadı...
      </div>
    );
  }

  //Bu sayfada eklenen şarkı verilerin hepsini gösterdik.

  return (
    <div className="flex flex-col gap-y-2 w-full px-6">
      {songs.map((song) => (
        <div key={song.id} className="flex items-center gap-x-4 w-full">
          <div className="flex-1">
            <MediaItem onClick={() => {}} data={song} />
          </div>
          {/* TODO:Beğenilme butonu eklenecek  */}
        </div>
      ))}
    </div>
  );
};

export default SearchContent;
