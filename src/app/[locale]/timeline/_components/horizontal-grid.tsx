"use client";

import Link from "next/link";
import type { common_ArchiveList } from "@/api/proto-http/frontend";
import { motion } from "framer-motion";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function HorizontalGrid({
  archives,
}: {
  archives: common_ArchiveList[];
}) {
  const { languageId } = useTranslationsStore((state) => state);

  return (
    <div className="h-full px-2.5 pb-2.5 pt-14 lg:px-7 lg:pt-24">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
        {archives.map((archive, index) => {
          const currentTranslation =
            archive?.translations?.find((t) => t.languageId === languageId) ||
            archive?.translations?.[0];

          return (
            <div key={archive.id} className="relative aspect-square">
              <Link href={archive.slug || ""} className="group">
                <motion.div
                  whileHover="hover"
                  initial="initial"
                  className="absolute inset-0 flex flex-col border"
                  variants={{
                    initial: {
                      borderColor: "transparent",
                      scale: 1,
                      zIndex: 0,
                    },
                    hover: {
                      borderColor: "white",
                      scale: 1.05,
                      zIndex: 10,
                    },
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  <motion.div
                    className="hidden h-9 w-full justify-between lowercase leading-none text-textColor lg:flex"
                    variants={{
                      initial: { opacity: 0, y: -10 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Text className="h-full self-start" variant="uppercase">
                      {archive.tag}
                    </Text>
                    <Text className="hidden h-full shrink-0 self-start lg:block">
                      {archive.createdAt?.split("T")[0]}
                    </Text>
                  </motion.div>

                  <motion.div
                    className="relative flex flex-1 items-center justify-center"
                    variants={{
                      initial: { scale: 1 },
                      hover: { scale: 0.75 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <ImageComponent
                      alt={currentTranslation?.heading + " " + index}
                      src={archive.thumbnail?.media?.fullSize?.mediaUrl || ""}
                      aspectRatio="1/1"
                      fit="scale-down"
                    />
                  </motion.div>

                  <motion.div className="flex h-9 items-end">
                    <motion.div
                      variants={{
                        initial: { color: "var(--highlight)" },
                        hover: { color: "var(--text)" },
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Text>{currentTranslation?.heading}</Text>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
