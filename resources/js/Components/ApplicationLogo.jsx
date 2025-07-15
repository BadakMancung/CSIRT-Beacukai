export default function ApplicationLogo({ className, ...props }) {
    return (
        <img 
            src="/images/logo_beacukai.png" 
            alt="Logo Bea Cukai" 
            className={`${className} object-contain`}
            style={{ 
                aspectRatio: '1/1', // Maintain square aspect ratio
                maxWidth: '100%',
                height: 'auto'
            }}
            {...props}
        />
    );
}
