'use client'

import { GroupChatDetails } from "@/features/trips/GroupChatDetails";
import { TripChat } from "@/features/trips/trip-chat";

export default function TripsPage() {
  return (
    <>
      <TripChat tripId={''}></TripChat>
      <GroupChatDetails groupId={''}></GroupChatDetails>
    </>
  )
}
