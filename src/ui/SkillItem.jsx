function SkillItem({ children }) {
  return (
    <div className="inline-block rounded-full bg-green-100 px-8 py-1 text-sm font-medium text-stone-800 shadow-sm ring-1 ring-green-300">
      {children}
    </div>
  );
}

export default SkillItem;
