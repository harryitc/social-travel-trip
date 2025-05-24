'use client'

import { GroupChatDetails } from "@/features/trips/GroupChatDetails";
import { TripChat } from "@/features/trips/trip-chat";
import { useParams } from "next/navigation";

export default function TripPageDetail() {
  const params = useParams();
  const tripId = params.id as string;

  return <>
    <TripChat tripId={tripId}></TripChat>
    <GroupChatDetails groupId={tripId}></GroupChatDetails>
  </>
}
