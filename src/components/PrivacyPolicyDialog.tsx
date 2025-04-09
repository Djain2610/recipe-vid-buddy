
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

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: April 9, 2025
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>
            This Privacy Policy describes how we collect, use, and disclose your information when you use our service.
          </p>
          
          <h3 className="text-lg font-semibold">1. Information Collection</h3>
          <p>
            We collect information you provide directly to us when you create an account, update your profile,
            use interactive features, fill out a form, or communicate with us. This may include your name, email address,
            and any other information you choose to provide.
          </p>
          
          <h3 className="text-lg font-semibold">2. Use of Information</h3>
          <p>
            We may use information about you for various purposes, including to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>
          
          <h3 className="text-lg font-semibold">3. Sharing of Information</h3>
          <p>
            We may share information about you as follows:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
            <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of us or others</li>
          </ul>
          
          <h3 className="text-lg font-semibold">4. Data Retention</h3>
          <p>
            We store the information we collect about you for as long as is necessary for the purpose(s) for which
            we originally collected it. We may retain certain information for legitimate business purposes or as
            required by law.
          </p>
          
          <h3 className="text-lg font-semibold">5. Security</h3>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
            access, disclosure, alteration, and destruction.
          </p>
          
          <h3 className="text-lg font-semibold">6. Your Choices</h3>
          <p>
            You may update, correct, or delete information about you at any time by logging into your account
            settings. If you wish to delete your account, please email us, but note that we may retain certain
            information as required by law or for legitimate business purposes.
          </p>
          
          <h3 className="text-lg font-semibold">7. Changes to this Policy</h3>
          <p>
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by
            revising the date at the top of the policy and, in some cases, we may provide you with additional
            notice.
          </p>
          
          <h3 className="text-lg font-semibold">8. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </div>
        <DialogClose asChild>
          <Button className="mt-4">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;
