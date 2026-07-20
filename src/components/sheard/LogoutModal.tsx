"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogOut, AlertTriangle } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-gradient-to-b from-red-50 to-white p-6 pt-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-[15px] leading-relaxed">
              Are you sure you want to log out? Any unsaved changes might be
              lost, and you will need to sign in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>
        </div>

        <DialogFooter className="p-6 pt-0 bg-white flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-11 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 rounded-xl font-semibold"
          >
            Stay Signed In
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="flex-1 h-11 transition-all duration-200 rounded-xl font-semibold shadow-lg shadow-red-200 flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Yes, Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
