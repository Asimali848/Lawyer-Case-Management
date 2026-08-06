import { motion, useReducedMotion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const questions = [
  {
    question: "What is JudgmentCalc?",
    answer:
      "JudgmentCalc is a cloud-based judgment interest calculator and judgment enforcement software designed for attorneys. It helps you calculate accrued interest, track payments and costs, manage judgment balances, and generate payoff demand letters from one secure platform.",
  },
  {
    question: "Can I use JudgmentCalc in my state?",
    answer:
      "JudgmentCalc is designed to support attorneys handling post-judgment collection and enforcement matters. We continue to expand support for different jurisdictions. If you have questions about your state's rules, please contact our team before subscribing.",
  },
  {
    question: "How is judgment interest calculated?",
    answer:
      "JudgmentCalc automatically calculates accrued interest based on your judgment details, applicable interest rate, payments, and other case activity. Your balance is updated whenever new transactions are added.",
  },
  {
    question: "I'm renewing my judgment and need to compound the interest. How do I do that?",
    answer:
      "JudgmentCalc allows you to update your judgment information when renewing a case. If your jurisdiction allows compounded interest, you can adjust your case accordingly. Our support team is also available to help guide you through the process.",
  },
  {
    question: "How are costs treated?",
    answer:
      "You can record enforcement costs, court-approved expenses, and other eligible costs directly within your case. JudgmentCalc automatically includes these updates when calculating your current judgment balance.",
  },
  {
    question: "Can I track payments and costs?",
    answer:
      "Yes. You can record payments, credits, enforcement costs, and other transactions. Every update automatically recalculates your judgment balance and accrued interest.",
  },
  {
    question: "Can I generate payoff demand letters?",
    answer:
      "Yes. JudgmentCalc allows you to generate professional payoff demand letters using your latest case information, helping you provide accurate payoff amounts quickly.",
  },
  {
    question: "What's your cancellation and refund policy?",
    answer:
      "You can cancel your subscription at any time before your next billing cycle. If you have questions about refunds or billing, please contact our support team for assistance.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your data is stored on a secure cloud-based platform with security measures designed to help protect your case information and provide reliable access whenever you need it.",
  },
  {
    question: "Do I need to install any software?",
    answer:
      "No. JudgmentCalc is completely cloud-based, so you can access your account from any modern web browser without downloading or installing software.",
  },
];

const Faq = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative w-full overflow-hidden border-y border-slate-200/80 bg-[#f8faf9] py-14 sm:py-16 lg:py-20">
      <div className="absolute -left-36 top-28 size-96 rounded-full bg-emerald-100/50 blur-3xl" />
      <div className="absolute -right-32 bottom-16 size-96 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-8 lg:px-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center sm:mb-12"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 sm:text-sm">Questions & Answers</p>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[2.75rem]">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-3">
              {questions.map(({ question, answer }, index) => (
                <AccordionItem
                  key={question}
                  value={`faq-${index}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 shadow-[0_10px_32px_rgba(15,23,42,0.05)] transition-all duration-300 data-[state=open]:border-emerald-200 data-[state=open]:shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:px-6"
                >
                  <AccordionTrigger className="py-5 text-base font-bold leading-6 text-slate-900 no-underline hover:text-primary hover:no-underline [&_svg]:size-5 [&_svg]:text-slate-400 group-data-[state=open]:[&_svg]:text-primary sm:text-lg">
                    <span className="flex items-start gap-3 text-left">
                      <span className="mt-0.5 text-xs font-black tracking-[0.08em] text-emerald-600 sm:text-sm">{String(index + 1).padStart(2, "0")}</span>
                      {question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pl-8 pr-7 text-sm leading-7 text-slate-600 sm:pl-10 sm:text-base sm:leading-8">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default Faq;
