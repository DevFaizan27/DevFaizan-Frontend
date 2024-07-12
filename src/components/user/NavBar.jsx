import { Button, Card, Typography } from "@material-tailwind/react";
import DevF from '../../assets/DevF.png'

export default function NavBar() {
  return (
    <Card className="rounded-none bg-blue-200">
      <ul className="">
        
        <Typography  as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium">
        <img src={DevF} className="h-10 rounded-full" alt="" />
          DevFaizan
        </Typography>
      </ul>
    </Card>
  )
}

