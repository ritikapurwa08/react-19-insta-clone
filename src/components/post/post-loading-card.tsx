import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function LoadingPostCard() {
  const loadingCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="flex flex-col py-6 space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          variants={loadingCardVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <Card className="p-0 m-0 border rounded-lg shadow-md">
            <CardContent>
              <CardHeader className="flex items-center p-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-grow ml-2 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
              <Skeleton className="h-60 w-full" />
              <CardDescription className="p-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
