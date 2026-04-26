"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Loader2 } from "lucide-react";
import { sendHiveMessage } from "../../actions.hive-chat";

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface HiveChatProps {
  hiveId: string;
  hiveName: string;
  currentUserId: string;
  disabled: boolean;
  initialMessages: Message[];
}

export default function HiveChat({
  hiveId,
  hiveName,
  currentUserId,
  disabled,
  initialMessages,
}: HiveChatProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [initialMessages]);

  const handleSend = () => {
    if (!content.trim() || disabled) return;

    const messageToSend = content;
    setContent("");

    startTransition(async () => {
      const res = await sendHiveMessage(hiveId, messageToSend);
      if (res?.error) setContent(messageToSend);
    });
  };

  return (
    <div className="flex flex-col h-full">

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-2 bg-background"
      >
        {initialMessages.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground mt-10">
            Start the conversation in{" "}
            <span className="font-medium">{hiveName}</span>
          </div>
        ) : (
          initialMessages.map((msg) => {
            const isMe = msg.user.id === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <Avatar className="size-6 mt-1">
                    <AvatarImage src={msg.user.image || undefined} />
                    <AvatarFallback className="text-[9px]">
                      {getInitials(msg.user.name)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[75%] px-3 py-2 text-sm leading-snug border shadow-sm
                  ${
                    isMe
                      ? "bg-primary/10 text-foreground rounded-2xl rounded-br-md"
                      : "bg-muted/40 text-foreground rounded-2xl rounded-bl-md"
                  }`}
                >
                  {!isMe && (
                    <p className="text-[10px] text-muted-foreground mb-1">
                      {msg.user.name}
                    </p>
                  )}

                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* INPUT */}
      <div className="px-3 py-2 border-t bg-background/80 backdrop-blur">
        <div className="flex items-center gap-2">

          <Button variant="ghost" size="icon" disabled={disabled}>
            <Paperclip className="size-4 text-muted-foreground" />
          </Button>

          <Input
            className="h-10 text-sm rounded-full bg-muted/20 border border-border/40"
            placeholder={disabled ? "Join hive to chat" : `Message hive...`}
            disabled={disabled || isPending}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <Button
            onClick={handleSend}
            disabled={disabled || isPending || !content.trim()}
            className="size-9 rounded-full bg-primary text-primary-foreground"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>

        </div>
      </div>
    </div>
  );
}