"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"

// Function to add a new location
export async function addNewLocation(newLocation: any) {
  try {
    // In a real application, this would be a database operation
    // For this example, we'll update the travel-data.ts file directly

    // Get the path to the travel-data.ts file
    const filePath = path.join(process.cwd(), "lib", "travel-data.ts")

    // Read the current file content
    const fileContent = await fs.readFile(filePath, "utf8")

    // Parse the current data array
    const dataStartIndex = fileContent.indexOf("export const travelData = [")
    const dataEndIndex = fileContent.lastIndexOf("]")

    if (dataStartIndex === -1 || dataEndIndex === -1) {
      throw new Error("Could not parse travel data file")
    }

    // Format the new location as a string
    const newLocationString = `  {
    id: ${newLocation.id},
    title: "${newLocation.title}",
    slug: "${newLocation.slug}",
    lat: ${newLocation.lat},
    lng: ${newLocation.lng},
    date: "${newLocation.date}",
    image: "${newLocation.image}",
    description: "${newLocation.description.replace(/"/g, '\\"')}",
    category: "${newLocation.category}",
    rating: ${newLocation.rating},
    highlights: [${newLocation.highlights.map((h: any) => `"${h.replace(/"/g, '\\"')}"`).join(", ")}],
  },`

    // Create the updated file content
    const updatedContent =
      fileContent.substring(0, dataStartIndex + "export const travelData = [".length) +
      "\n" +
      newLocationString +
      fileContent.substring(dataStartIndex + "export const travelData = [".length, fileContent.length)

    // Write the updated content back to the file
    await fs.writeFile(filePath, updatedContent, "utf8")

    // Revalidate the paths to update the UI
    revalidatePath("/")
    revalidatePath("/timeline")
    revalidatePath("/blog/[slug]")

    return { success: true }
  } catch (error: any) {
    console.error("Error adding new location:", error)
    return { success: false, error: error.message }
  }
}

// Trong một ứng dụng thực tế, bạn sẽ cần một hàm để tải lên hình ảnh
// Ví dụ với Vercel Blob:
/*
import { put } from '@vercel/blob';

export async function uploadImage(file: File) {
  const filename = `${Date.now()}-${file.name}`;
  const { url } = await put(filename, file, { access: 'public' });
  return url;
}
*/
