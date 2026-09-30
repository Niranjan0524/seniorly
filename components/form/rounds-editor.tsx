"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
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

export function RoundsEditor({
  rounds,
  onChange,
}: {
  rounds: RoundDraft[];
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
            className="rounded-lg border border-line bg-panel p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-2xl text-paper">Round {index + 1}</h3>
              <div className="flex items-center gap-3">
                {rounds.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className={quietButton}
                      disabled={index === 0}
                      onClick={() => moveRound(index, -1)}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className={quietButton}
                      disabled={index === rounds.length - 1}
                      onClick={() => moveRound(index, 1)}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className={quietButton}
                      onClick={() => onChange(rounds.filter((item) => item.id !== round.id))}
                    >
                      Remove
                    </button>
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Round type" htmlFor={`${round.id}-type`}>
                <SelectInput
                  id={`${round.id}-type`}
                  className="bg-fill"
                  value={round.roundType}
                  onChange={(event) =>
                    updateRound(round.id, (current) => ({
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
              <Field label="Title" htmlFor={`${round.id}-title`} hint="Optional">
                <TextInput
                  id={`${round.id}-title`}
                  className="bg-fill"
                  value={round.title}
                  maxLength={120}
                  placeholder="Technical round 1"
                  onChange={(event) =>
                    updateRound(round.id, (current) => ({ ...current, title: event.target.value }))
                  }
                />
              </Field>
              <Field label="Duration" htmlFor={`${round.id}-duration`} hint="Minutes, if you remember">
                <TextInput
                  id={`${round.id}-duration`}
                  className="bg-fill"
                  inputMode="numeric"
                  value={round.durationMinutes}
                  placeholder="45"
                  onChange={(event) =>
                    updateRound(round.id, (current) => ({
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
                    updateRound(round.id, (current) => ({
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

            <div className="mt-4">
              <Field label="Topics" htmlFor={`${round.id}-topic`} hint="Optional, up to 12">
                <TextInput
                  id={`${round.id}-topic`}
                  className="bg-fill"
                  value={round.topicDraft}
                  placeholder="DSA, operating systems"
                  onChange={(event) =>
                    updateRound(round.id, (current) => ({
                      ...current,
                      topicDraft: event.target.value,
                    }))
                  }
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== ",") {
                      return;
                    }
                    event.preventDefault();
                    updateRound(round.id, addTopic);
                  }}
                  onBlur={() => updateRound(round.id, addTopic)}
                />
              </Field>
              {round.topics.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {round.topics.map((topic) => (
                    <li key={topic}>
                      <button
                        type="button"
                        className="rounded-lg border border-line bg-fill px-2.5 py-1 text-sm text-paper transition-colors duration-200 hover:border-brass"
                        onClick={() =>
                          updateRound(round.id, (current) => ({
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
            </div>

            <div className="mt-4">
              <Field label="Notes" htmlFor={`${round.id}-notes`} hint="Optional">
                <TextArea
                  id={`${round.id}-notes`}
                  className="bg-fill"
                  value={round.notes}
                  maxLength={4000}
                  placeholder="What the round focused on"
                  onChange={(event) =>
                    updateRound(round.id, (current) => ({ ...current, notes: event.target.value }))
                  }
                />
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
                    <TextInput
                      aria-label={`Question ${questionIndex + 1}`}
                      className="bg-fill"
                      value={question.prompt}
                      maxLength={1000}
                      placeholder="What did they ask?"
                      onChange={(event) =>
                        updateRound(round.id, (current) => ({
                          ...current,
                          questions: current.questions.map((item) =>
                            item.id === question.id ? { ...item, prompt: event.target.value } : item,
                          ),
                        }))
                      }
                    />
                    {round.questions.length > 1 ? (
                      <button
                        type="button"
                        className={`${quietButton} shrink-0 pt-2`}
                        onClick={() =>
                          updateRound(round.id, (current) => ({
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
                  onClick={() =>
                    updateRound(round.id, (current) => ({
                      ...current,
                      questions: [
                        ...current.questions,
                        { id: nextId("question"), prompt: "" },
                      ],
                    }))
                  }
                >
                  Add a question
                </SecondaryButton>
                {round.questions.length >= maxQuestions ? (
                  <p className="text-sm text-faint">Fifteen questions is the most for one round.</p>
                ) : null}
              </div>
            </div>
          </motion.section>
        ))}
      </AnimatePresence>

      <div className="flex flex-wrap items-center gap-3">
        <SecondaryButton
          type="button"
          disabled={rounds.length >= maxRounds}
          onClick={() =>
            onChange([...rounds, createRound(nextId("round"), nextId("question"))])
          }
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
