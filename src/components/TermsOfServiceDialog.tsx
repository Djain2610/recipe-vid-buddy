
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TermsOfServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsOfServiceDialog: React.FC<TermsOfServiceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Last updated: April 9, 2025
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using
            our website and services.
          </p>
          
          <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
          <p>
            By accessing or using our service, you agree to be bound by these Terms. If you disagree
            with any part of the terms, you may not access the service.
          </p>
          
          <h3 className="text-lg font-semibold">2. Use of Service</h3>
          <p>
            Our service allows you to discover and save recipe videos. You are responsible for maintaining
            the confidentiality of your account and password and for restricting access to your account.
          </p>
          
          <h3 className="text-lg font-semibold">3. Content</h3>
          <p>
            Our service allows you to post, link, store, share and otherwise make available certain
            information, text, graphics, videos, or other material. You are responsible for the legality,
            reliability, and appropriateness of any content you post.
          </p>
          
          <h3 className="text-lg font-semibold">4. Intellectual Property</h3>
          <p>
            The service and its original content, features, and functionality are and will remain the
            exclusive property of our company and its licensors. The service is protected by copyright,
            trademark, and other laws.
          </p>
          
          <h3 className="text-lg font-semibold">5. Termination</h3>
          <p>
            We may terminate or suspend your account and bar access to the service immediately, without
            prior notice or liability, under our sole discretion, for any reason whatsoever and without
            limitation, including but not limited to a breach of the Terms.
          </p>
          
          <h3 className="text-lg font-semibold">6. Limitation of Liability</h3>
          <p>
            In no event shall we be liable for any indirect, incidental, special, consequential or
            punitive damages, including without limitation, loss of profits, data, use, goodwill, or
            other intangible losses, resulting from your access to or use of or inability to access or
            use the service.
          </p>
          
          <h3 className="text-lg font-semibold">7. Changes</h3>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            If a revision is material we will provide at least 30 days notice prior to any new terms
            taking effect.
          </p>
          
          <h3 className="text-lg font-semibold">8. Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us.
          </p>
        </div>
        <DialogClose asChild>
          <Button className="mt-4">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfServiceDialog;
