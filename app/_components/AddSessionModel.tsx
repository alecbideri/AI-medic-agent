"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, PlusCircle } from "lucide-react";

function AddSessionModel() {
  const [note, setNote] = useState<string>();
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full mt-2 cursor-pointer">
          <PlusCircle /> Start a consultation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2>Add Symptoms or Any Other Details</h2>
              <Textarea
                placeholder="Add Details here..."
                className="mt-3 h-[150px]"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"} className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={!note} className="cursor-pointer">
            <ArrowRight /> Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddSessionModel;
