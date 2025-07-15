export default function BeaCukaiLogoSimple({ size = "medium", className = "" }) {
    const sizeStyles = {
        small: { width: '32px', height: '32px' },
        medium: { width: '48px', height: '48px' },
        large: { width: '72px', height: '72px' },
        xlarge: { width: '96px', height: '96px' }
    };

    return (
        <div 
            className={`flex items-center justify-center bg-white rounded-lg p-1 shadow-sm ${className}`}
            style={sizeStyles[size]}
        >
            <img 
                src="/images/logo_beacukai.png" 
                alt="Logo Bea Cukai" 
                className="w-full h-full object-contain"
                style={{ 
                    padding: '4px',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}
            />
        </div>
    );
}
