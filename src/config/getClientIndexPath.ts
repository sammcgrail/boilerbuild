import { fileURLToPath } from "url"
import path, { dirname } from "path"

const getClientIndexPath = () => {
  const currentPath = dirname(fileURLToPath(__filename))
  let indexPath = path.join(currentPath, "../../public/index.html")
  if (process.env["NODE_ENV"] !== "production") {
    indexPath = path.join(currentPath, "../web/index.html")
  }

  return indexPath
}

export default getClientIndexPath
