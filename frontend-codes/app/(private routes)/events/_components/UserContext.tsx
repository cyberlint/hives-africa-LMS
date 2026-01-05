
// Contextualize message depending on user.
import { getCurrentUser } from "@/domains/auth/user"

const user = await getCurrentUser();

const export async function UserContext() {
    

  return (
    <div>UserContext</div>
  )
}
