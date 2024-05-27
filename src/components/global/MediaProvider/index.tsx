"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export function MediaProvider({
  mediaList,
  ItemComponent,
}: {
  mediaList: common_MediaFull[];
  ItemComponent: React.ComponentType<{ singleMedia: common_MediaFull }>;
}) {
  return (
    // TO-DO add faster animation - check docs of package
    <PhotoProvider>
      {mediaList.map((i) => (
        <ItemComponent key={i.id} singleMedia={i} />
      ))}
    </PhotoProvider>
  );
}
