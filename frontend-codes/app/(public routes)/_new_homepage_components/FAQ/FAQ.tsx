"use client";

import { useState } from "react";

import FAQItem from "./FAQItem";
import { faqs } from "./faq.data";

export default function FAQ() {
  const [open, setOpen] = useState("1");
  const leftColumn = faqs.filter((_, index) => index % 2 === 0);
  const rightColumn = faqs.filter((_, index) => index % 2 === 1);

  return (
    <section className="py-15">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid gap-x-16 lg:grid-cols-2">

  <div>
    {leftColumn.map((faq) => (
      <FAQItem
        key={faq.id}
        question={faq.question}
        answer={faq.answer}
        open={open === faq.id}
        onClick={() =>
          setOpen(open === faq.id ? "" : faq.id)
        }
      />
    ))}
  </div>

  <div>
    {rightColumn.map((faq) => (
      <FAQItem
        key={faq.id}
        question={faq.question}
        answer={faq.answer}
        open={open === faq.id}
        onClick={() =>
          setOpen(open === faq.id ? "" : faq.id)
        }
      />
    ))}
  </div>

</div>

      </div>

    </section>
  );
}