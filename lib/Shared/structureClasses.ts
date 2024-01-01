export default function structureClasses(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


