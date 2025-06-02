'use client'

import { GroupChatDetails } from "@/features/trips/GroupChatDetails";
import { TripChat } from "@/features/trips/trip-chat";

export default function TripsPage() {
  return (
    <>
      <div className="flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
        <TripChat tripId={''}></TripChat>
      </div>
      <div className="w-[350px] min-w-[350px] flex-shrink-0 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
        <GroupChatDetails groupId={''}></GroupChatDetails>
      </div>
    </>
  )
}
