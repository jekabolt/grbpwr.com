"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import { PhotoProvider } from "react-photo-view";

export function MediaProvider({
  mediaList,
  ItemComponent,
}: {
  mediaList: common_MediaFull[];
  ItemComponent: React.ComponentType<{ singleMedia: common_MediaFull }>;
}) {
  return (
    <PhotoProvider>
      {mediaList.map((i) => (
        <ItemComponent key={i.id} singleMedia={i} />
      ))}
    </PhotoProvider>
  );
}
