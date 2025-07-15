export default function PartnershipLogo({ 
    src, 
    alt, 
    title, 
    description, 
    size = "large",
    className = "" 
}) {
    const sizeClasses = {
        small: "w-32 h-20",
        medium: "w-40 h-24", 
        large: "w-48 h-32",
        xlarge: "w-56 h-36"
    };

    return (
        <div className={`bg-white rounded-xl shadow-lg p-8 text-center transition-transform duration-300 hover:scale-105 ${className}`}>
            <div className="mb-6">
                <img 
                    src={src}
                    alt={alt}
                    className={`${sizeClasses[size]} object-contain mx-auto`}
                    style={{ 
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                    }}
                />
            </div>
            {title && (
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            )}
            {description && (
                <p className="text-gray-600 leading-relaxed">{description}</p>
            )}
        </div>
    );
}
