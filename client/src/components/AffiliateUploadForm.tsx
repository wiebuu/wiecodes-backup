import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AffiliateInstructions({ formData, setFormData }) {
  return (
    <div className="space-y-3">
      <Input
        required
        type="url"
        value={formData.githubRepo}
        onChange={(e) =>
          setFormData({ ...formData, githubRepo: e.target.value })
        }
        placeholder="Paste your product link (e.g., Gumroad, Payhip)"
      />

      <div className="text-sm text-muted-foreground">
        💡 You’ll earn via your platform directly. We act as an affiliate (usually 15–30%).<br />
        Please make sure you’ve added us as an affiliate on your product.
      </div>

      <div className="text-sm text-muted-foreground">
        ⚠️ The affiliate commission must be <strong>reasonable (minimum 15–20%)</strong>.
        We only list products that offer fair commissions and pricing.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
        <Button asChild variant="outline" className="text-sm w-full">
          <a
            href="https://gumroad.com/products"
            target="_blank"
            rel="noopener noreferrer"
          >
            🟣 Gumroad
          </a>
        </Button>

        <Button asChild variant="outline" className="text-sm w-full">
          <a
            href="https://payhip.com/products"
            target="_blank"
            rel="noopener noreferrer"
          >
            💸 Payhip
          </a>
        </Button>
      </div>

      <div className="text-sm text-muted-foreground pt-1">
        → On your platform, go to <strong>Edit › Affiliates tab</strong> or similar settings.<br />
        → Add our email:&nbsp;
        <strong
          onClick={() => {
            navigator.clipboard.writeText('wiecodes@gmail.com');
            toast.success('Email copied to clipboard!');
          }}
          className="cursor-pointer text-foreground hover:underline"
        >
          wiecodes@gmail.com
        </strong>{' '}
        as an affiliate.
      </div>

    </div>
  );
}
