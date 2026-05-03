import logoImage from './logo.png';

export default function BrandLogo({ compact = false }) {
  return (
    <span className={`brand-logo ${compact ? 'compact' : ''}`}>
      <img src={logoImage} alt="SwapMarket" className="brand-logo-image" />
    </span>
  );
}
