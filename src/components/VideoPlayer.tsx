
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoSearchResult } from "@/lib/types";

interface VideoPlayerProps {
  video: VideoSearchResult | null;
  isLoading: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full h-[360px] bg-muted animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-6 bg-muted-foreground/10 rounded-md w-3/4"></div>
          <div className="h-4 bg-muted-foreground/10 rounded-md w-1/2 mt-2"></div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[270px]">
          <div className="text-muted-foreground">Loading video...</div>
        </CardContent>
      </Card>
    );
  }

  if (!video) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No video found</CardTitle>
          <CardDescription>
            We couldn't find a related video for this recipe.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const videoUrl = `https://www.youtube.com/embed/${video.id.videoId}`;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Video Tutorial</CardTitle>
        <CardDescription>
          {video.snippet.channelTitle} • {new Date(video.snippet.publishedAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          title={video.snippet.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video"
        ></iframe>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;
