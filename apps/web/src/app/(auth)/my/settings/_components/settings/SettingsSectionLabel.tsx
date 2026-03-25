interface IProps {
  children: string;
}

const SettingsSectionLabel = ({ children }: IProps) => {
  return (
    <h2 className="px-1 pt-6 pb-2 text-xs font-bold tracking-wider text-on-surface-variant uppercase">
      {children}
    </h2>
  );
};

export default SettingsSectionLabel;
