function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["chat", "files", "overview"];

  return (
    <div className="h-11 border-b border-[#222] flex items-end px-8 gap-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative h-full text-xs font-medium capitalize transition ${
              isActive ? "text-white" : "text-[#555] hover:text-[#aaa]"
            }`}
          >
            {tab}

            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
