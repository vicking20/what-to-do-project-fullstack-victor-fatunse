//taskPage.tsx
//When tasks are clicked, it renders the activities / tasks page
import ActivityBox from "../Misc/ActivityBox"
export default function TaskPage() {
  return (
    <div className="absolute top-22 left-0 w-full flex justify-center">
      <div className="w-full px-6">
        <div>
          <ActivityBox />
        </div>
      </div>
    </div>
  )
}
 