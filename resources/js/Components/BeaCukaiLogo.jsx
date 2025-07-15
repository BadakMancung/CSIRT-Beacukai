export default function BeaCukaiLogo({ size = "medium", className = "", padding = true, ...props }) {
    const sizeClasses = {
        small: padding ? "w-8 h-8" : "w-6 h-6",
        medium: padding ? "w-12 h-12" : "w-9 h-9", 
        large: padding ? "w-20 h-20" : "w-16 h-16",
        xlarge: padding ? "w-24 h-24" : "w-20 h-20"
    };

    return (
        <div 
            className={`${sizeClasses[size]} flex items-center justify-center ${className}`} 
            {...props}
        >
            <img 
                src="/images/logo_beacukai.png" 
                alt="Logo Bea Cukai" 
                className={`object-contain ${padding ? 'w-4/5 h-4/5' : 'w-full h-full'}`}
                style={{ 
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}
            />
        </div>
    );
}
