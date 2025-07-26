import { redirect } from "next/navigation";

export default function AI_Teacher_Page() {
  redirect("/ai-teacher/chat/new?teacherId=1f4369fa-f0e4-444f-bf63-9622fa7d59c3"); // teacher ID is public so this is fine (?)
};