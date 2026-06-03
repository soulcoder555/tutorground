import { LiveClassRoom } from "@/components/session/LiveClassRoom";

export default function LiveClassPage({ params }: { params: { sessionId: string } }) {
  return <LiveClassRoom sessionId={params.sessionId} userName="TutorGround User" isTutor />;
}

