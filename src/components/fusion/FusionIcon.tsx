export const FusionIcon = ({
  icon,
  pack,
  className,
}: {
  icon: string;
  className?: string;
  pack: "coins" | "interface" | "web3";
}) => {
  return (
    <svg viewBox="0 0 64 64" className={`${className} fusion`}>
      <use href={`/sprites/fusion-${pack}.svg#${icon}`} />
    </svg>
  );
};
