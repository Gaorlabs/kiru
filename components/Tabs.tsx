import React, { useState, Children, isValidElement, ReactNode } from 'react';

interface TabsProps {
    children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = Children.toArray(children).filter(isValidElement);

    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="flex" aria-label="Tabs">
                    {tabs.map((child, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`flex-1 whitespace-nowrap py-3 px-1 font-medium text-sm transition-colors ${
                                activeTab === index
                                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            {/* FIX: Add type assertion to access the 'title' prop. */}
                            {(child.props as { title: ReactNode }).title}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto">
                {tabs[activeTab]}
            </div>
        </div>
    );
};
