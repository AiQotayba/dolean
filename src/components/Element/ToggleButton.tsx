import React from 'react';

const ToggleButton = ({ name, value, register, children }: any) => {
    return (
        <button
            type="button"
            {...register(name)}
            value={value}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1"
        >
            {children}
        </button>
    );
};

export default ToggleButton;
