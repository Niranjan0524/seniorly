"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Field, SecondaryButton, SelectInput, TextArea, TextInput } from "@/components/form/fields";
import { difficulties, roundTypes, type Difficulty, type RoundType } from "@/lib/models/enums";

const maxRounds = 8;
const maxQuestions = 15;
const maxTopics = 12;
const maxTopicLength = 40;

const roundTypeLabels: Record<RoundType, string> = {
  online_assessment: "Online assessment",
  technical: "Technical",
  managerial: "Managerial",
  hr: "HR",
  other: "Other",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export type QuestionDraft = {
  id: string;
  prompt: string;
};

export type RoundDraft = {
  id: string;
  roundType: RoundType | "";
  title: string;
  durationMinutes: string;
  difficulty: Difficulty | "";
  notes: string;
  topics: string[];
  topicDraft: string;
  questions: QuestionDraft[];
};

export function createRound(id: string, questionId: string): RoundDraft {
  return {
    id,
    roundType: "",
    title: "",
    durationMinutes: "",
    difficulty: "",
    notes: "",
    topics: [],
    topicDraft: "",
    questions: [{ id: questionId, prompt: "" }],
  };
}

const quietButton =
  "text-sm text-muted transition-colors duration-200 hover:text-brass disabled:pointer-events-none disabled:opacity-40";

function addTopic(round: RoundDraft) {
  const parts = round.topicDraft
    .split(",")
    .map((topic) => topic.trim())
    .filter((topic) => topic.length > 0);
  if (parts.length === 0) {
    return round;
  }

  const topics = [...round.topics];
  for (const part of parts) {
    if (topics.length >= maxTopics) {
      break;
    }
    const capped = part.slice(0, maxTopicLength);
    const alreadyAdded = topics.some((item) => item.toLowerCase() === capped.toLowerCase());
    if (!alreadyAdded) {
      topics.push(capped);
    }
  }

  return { ...round, topics, topicDraft: "" };
}

function roundSummary(round: RoundDraft) {
  const parts = [
    round.durationMinutes ? `${round.durationMinutes} min` : "",
    round.difficulty ? difficultyLabels[round.difficulty] : "",
    round.topics.join(" · "),
  ].filter((part) => part.length > 0);

  return parts.join(" · ");
}

export type RoundFieldErrors = {
  roundType?: string;
  title?: string;
  durationMinutes?: string;
  notes?: string;
  topics?: string;
  questions: Array<string | undefined>;
};

function RoundCard({
  round,
  index,
  total,
  errors,
  onMove,
  onRemove,
  onUpdate,
  onAddQuestion,
}: {
  round: RoundDraft;
  index: number;
  total: number;
  errors?: RoundFieldErrors;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onUpdate: (updater: (round: RoundDraft) => RoundDraft) => void;
  onAddQuestion: () => void;
}) {
  const hasDetails = Boolean(
    round.title.trim() ||
      round.durationMinutes ||
      round.difficulty ||
      round.notes.trim() ||
      round.topics.length > 0 ||
      round.topicDraft.trim(),
  );
  const [detailsOpen, setDetailsOpen] = useState(hasDetails);
  const summary = roundSummary(round);
  const detailError = Boolean(errors?.title || errors?.durationMinutes || errors?.notes || errors?.topics);

  useEffect(() => {
    if (detailError) {
      setDetailsOpen(true);
    }
  }, [detailError]);

  return (
    <section className="rounded-lg border border-line bg-panel p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="text-2xl text-paper">Round {index + 1}</h3>
          {round.title.trim() || round.roundType ? (
            <p className="mt-1 text-sm text-muted">
              {[round.title.trim(), round.roundType ? roundTypeLabels[round.roundType] : ""]
                .filter((part) => part.length > 0)
                .join(" · ")}
            </p>
          ) : null}
        </div>
        {total > 1 ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={quietButton}
              disabled={index === 0}
              onClick={() => onMove(-1)}
            >
              Up
            </button>
            <button
              type="button"
              className={quietButton}
              disabled={index === total - 1}
              onClick={() => onMove(1)}
            >
              Down
            </button>
            <button type="button" className={quietButton} onClick={onRemove}>
              Remove
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <Field label="Round type" htmlFor={`${round.id}-type`} error={errors?.roundType}>
          <SelectInput
            id={`${round.id}-type`}
            className="bg-fill"
            aria-invalid={Boolean(errors?.roundType)}
            value={round.roundType}
            onChange={(event) =>
              onUpdate((current) => ({
                ...current,
                roundType: event.target.value as RoundType | "",
              }))
            }
          >
            <option value="">Choose</option>
            {roundTypes.map((type) => (
              <option key={type} value={type}>
                {roundTypeLabels[type]}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <p className="text-sm text-muted">Questions</p>
        <AnimatePresence initial={false}>
          {round.questions.map((question, questionIndex) => (
            <motion.div
              key={question.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex items-start gap-2"
            >
              <span className="w-7 pt-2 text-sm text-faint tabular-nums">
                {String(questionIndex + 1).padStart(2, "0")}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5" data-invalid={errors?.questions[questionIndex] ? true : undefined}>
              <TextInput
                aria-label={`Question ${questionIndex + 1}`}
                aria-invalid={Boolean(errors?.questions[questionIndex])}
                className="bg-fill"
                value={question.prompt}
                maxLength={1000}
                placeholder="What did they ask?"
                onChange={(event) =>
                  onUpdate((current) => ({
                    ...current,
                    questions: current.questions.map((item) =>
                      item.id === question.id ? { ...item, prompt: event.target.value } : item,
                    ),
                  }))
                }
              />
              {errors?.questions[questionIndex] ? (
                <p className="text-sm text-clay">{errors.questions[questionIndex]}</p>
              ) : null}
              </div>
              {round.questions.length > 1 ? (
                <button
                  type="button"
                  className={`${quietButton} shrink-0 pt-2`}
                  onClick={() =>
                    onUpdate((current) => ({
                      ...current,
                      questions: current.questions.filter((item) => item.id !== question.id),
                    }))
                  }
                >
                  Remove
                </button>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex flex-wrap items-center gap-3">
          <SecondaryButton
            type="button"
            disabled={round.questions.length >= maxQuestions}
            onClick={onAddQuestion}
          >
            Add a question
          </SecondaryButton>
          {round.questions.length >= maxQuestions ? (
            <p className="text-sm text-faint">Fifteen questions is the most for one round.</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <button
          type="button"
          className={quietButton}
          aria-expanded={detailsOpen}
          aria-controls={`${round.id}-details`}
          onClick={() => setDetailsOpen((open) => !open)}
        >
          {detailsOpen ? "Hide details" : hasDetails ? "Show details" : "Add details"}
        </button>
        {!detailsOpen && summary ? <p className="mt-2 text-sm text-faint">{summary}</p> : null}
        <AnimatePresence initial={false}>
          {detailsOpen ? (
            <motion.div
              id={`${round.id}-details`}
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title" htmlFor={`${round.id}-title`} hint="Optional" error={errors?.title}>
                    <TextInput
                      id={`${round.id}-title`}
                      className="bg-fill"
                      aria-invalid={Boolean(errors?.title)}
                      value={round.title}
                      maxLength={120}
                      placeholder="Technical round 1"
                      onChange={(event) =>
                        onUpdate((current) => ({ ...current, title: event.target.value }))
                      }
                    />
                  </Field>
                  <Field
                    label="Duration"
                    htmlFor={`${round.id}-duration`}
                    hint="Minutes, if you remember"
                    error={errors?.durationMinutes}
                  >
                    <TextInput
                      id={`${round.id}-duration`}
                      className="bg-fill"
                      aria-invalid={Boolean(errors?.durationMinutes)}
                      inputMode="numeric"
                      value={round.durationMinutes}
                      placeholder="45"
                      onChange={(event) =>
                        onUpdate((current) => ({
                          ...current,
                          durationMinutes: event.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Difficulty" htmlFor={`${round.id}-difficulty`} hint="Optional">
                    <SelectInput
                      id={`${round.id}-difficulty`}
                      className="bg-fill"
                      value={round.difficulty}
                      onChange={(event) =>
                        onUpdate((current) => ({
                          ...current,
                          difficulty: event.target.value as Difficulty | "",
                        }))
                      }
                    >
                      <option value="">Not sure</option>
                      {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficultyLabels[difficulty]}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>
                </div>

                <Field label="Topics" htmlFor={`${round.id}-topic`} hint="Optional, up to 12" error={errors?.topics}>
                  <TextInput
                    id={`${round.id}-topic`}
                    className="bg-fill"
                    value={round.topicDraft}
                    placeholder="DSA, operating systems"
                    onChange={(event) =>
                      onUpdate((current) => ({
                        ...current,
                        topicDraft: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== ",") {
                        return;
                      }
                      event.preventDefault();
                      onUpdate(addTopic);
                    }}
                    onBlur={() => onUpdate(addTopic)}
                  />
                </Field>
                {round.topics.length > 0 ? (
                  <ul className="-mt-2 flex flex-wrap gap-2">
                    {round.topics.map((topic) => (
                      <li key={topic}>
                        <button
                          type="button"
                          className="rounded-lg border border-line bg-fill px-2.5 py-1 text-sm text-paper transition-colors duration-200 hover:border-brass"
                          onClick={() =>
                            onUpdate((current) => ({
                              ...current,
                              topics: current.topics.filter((item) => item !== topic),
                            }))
                          }
                        >
                          {topic}
                          <span className="sr-only">, remove topic</span>
                          <span aria-hidden="true"> ×</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <Field label="Notes" htmlFor={`${round.id}-notes`} hint="Optional" error={errors?.notes}>
                  <TextArea
                    id={`${round.id}-notes`}
                    className="bg-fill"
                    aria-invalid={Boolean(errors?.notes)}
                    value={round.notes}
                    maxLength={4000}
                    placeholder="What the round focused on"
                    onChange={(event) =>
                      onUpdate((current) => ({ ...current, notes: event.target.value }))
                    }
                  />
                </Field>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

function roundErrorsAt(errors: Record<string, string> | undefined, index: number): RoundFieldErrors | undefined {
  if (!errors) {
    return undefined;
  }
  const prefix = `rounds.${index}.`;
  const questions: Array<string | undefined> = [];
  for (const [path, message] of Object.entries(errors)) {
    if (!path.startsWith(prefix) || !path.endsWith(".prompt")) {
      continue;
    }
    const questionIndex = Number(path.slice(prefix.length).split(".")[1]);
    if (Number.isInteger(questionIndex)) {
      questions[questionIndex] = message;
    }
  }
  const slice: RoundFieldErrors = {
    roundType: errors[`${prefix}roundType`],
    title: errors[`${prefix}title`],
    durationMinutes: errors[`${prefix}durationMinutes`],
    notes: errors[`${prefix}notes`],
    topics:
      errors[`${prefix}topics`] ??
      Object.entries(errors).find(([path]) => path.startsWith(`${prefix}topics`))?.[1],
    questions,
  };
  const hasError = Boolean(
    slice.roundType || slice.title || slice.durationMinutes || slice.notes || slice.topics || questions.some(Boolean),
  );
  return hasError ? slice : undefined;
}

export function RoundsEditor({
  rounds,
  errors,
  onChange,
}: {
  rounds: RoundDraft[];
  errors?: Record<string, string>;
  onChange: (rounds: RoundDraft[]) => void;
}) {
  const idRef = useRef(2);

  function nextId(prefix: string) {
    idRef.current += 1;
    return `${prefix}-${idRef.current}`;
  }

  function updateRound(id: string, updater: (round: RoundDraft) => RoundDraft) {
    onChange(rounds.map((round) => (round.id === id ? updater(round) : round)));
  }

  function moveRound(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= rounds.length) {
      return;
    }
    const next = [...rounds];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {rounds.map((round, index) => (
          <motion.section
            key={round.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <RoundCard
              round={round}
              index={index}
              total={rounds.length}
              errors={roundErrorsAt(errors, index)}
              onMove={(direction) => moveRound(index, direction)}
              onRemove={() => onChange(rounds.filter((item) => item.id !== round.id))}
              onUpdate={(updater) => updateRound(round.id, updater)}
              onAddQuestion={() =>
                updateRound(round.id, (current) => ({
                  ...current,
                  questions: [...current.questions, { id: nextId("question"), prompt: "" }],
                }))
              }
            />
          </motion.section>
        ))}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-3">
        <SecondaryButton
          type="button"
          disabled={rounds.length >= maxRounds}
          onClick={() => onChange([...rounds, createRound(nextId("round"), nextId("question"))])}
        >
          Add a round
        </SecondaryButton>
        {rounds.length >= maxRounds ? (
          <p className="text-sm text-faint">Eight rounds is the most this form keeps.</p>
        ) : null}
      </div>
    </div>
  );
}
