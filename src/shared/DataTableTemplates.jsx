const statusTemplate = (status) => {
    const getStatusClass = (status) => {
        const baseClasses = "text-sm px-2 py-0.5 rounded-lg inline-block font-medium border";
        switch (status) {
            case "Starting":
                return `${baseClasses} text-pink-700 bg-pink-50 border-pink-200`;
            case "Ready":
                return `${baseClasses} text-green-700 bg-green-50 border-green-200`;
            case "Running":
                return `${baseClasses} text-cyan-700 bg-cyan-50 border-cyan-200`;
            case "Stopping":
                return `${baseClasses} text-red-700 bg-red-50 border-red-200`;
            case "Stopped":
                return `${baseClasses} text-red-700 bg-red-50 border-red-200`;
            case "Paused":
                return `${baseClasses} text-yellow-700 bg-yellow-50 border-yellow-200`;
            default:
                return `${baseClasses} text-gray-700 bg-gray-50 border-gray-200`;
        }
    };

    return (
        <span className={getStatusClass(status)}>
            <i style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                marginRight: '6px',
                verticalAlign: 'middle'
            }}></i>
            {status}
        </span>
    );
};

export { statusTemplate }