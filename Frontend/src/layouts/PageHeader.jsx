import { motion } from 'framer-motion';

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end"
    >
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
        <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </motion.div>
  );
}
