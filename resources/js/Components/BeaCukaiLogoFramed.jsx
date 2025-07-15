export default function BeaCukaiLogoFramed({ 
    size = "medium", 
    className = "", 
    frameColor = "bg-white",
    rounded = true 
}) {
    const sizeClasses = {
        small: "w-10 h-10",
        medium: "w-14 h-14", 
        large: "w-20 h-20",
        xlarge: "w-28 h-28"
    };

    const roundedClass = rounded ? "rounded-lg" : "rounded-none";

    return (
        <div 
            className={`${sizeClasses[size]} ${frameColor} ${roundedClass} flex items-center justify-center shadow-sm border border-gray-100 ${className}`}
        >
            <img 
                src="/images/logo_beacukai.png" 
                alt="Logo Bea Cukai" 
                className="w-3/4 h-3/4 object-contain"
                style={{ 
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}
            />
        </div>
    );
}
