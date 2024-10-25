"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

// todo: rework this section
// should incapsulate logic
// dont need to pass ItemComponent as render prop
// should be either unified or use "style" property

export function FullscreenImagesCarousel({
  mediaList,
  ItemComponent,
}: {
  mediaList: common_MediaFull[];
  ItemComponent: React.ComponentType<{ singleMedia: common_MediaFull }>;
}) {
  return (
    // TO-DO add faster animation - check docs of package
    (<PhotoProvider>
      {mediaList.map((i, index) => (
        <ItemComponent key={index} singleMedia={i} />
      ))}
    </PhotoProvider>)
  );
}
