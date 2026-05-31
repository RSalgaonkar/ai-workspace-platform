"use client";

import {
  FormEvent,
  useMemo,
  useState
} from "react";

import {
  BriefcaseBusiness,
  CheckCircle2,
  Lock,
  Settings,
  UserRound
} from "lucide-react";

import Card from "@/components/ui/card";

import {
  useAuthStore
} from "@/types/auth.store";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  company: string;
  bio: string;
  timezone: string;
  language: string;
  status: string;
  twoFactor: boolean;
  recoveryEmail: string;
};

const defaultProfile: ProfileForm = {
  name: "",
  email: "",
  phone: "",
  title: "",
  department: "",
  company: "",
  bio: "",
  timezone: "",
  language: "",
  status: "",
  twoFactor: false,
  recoveryEmail: ""
};

const tabs = [
  {
    id: "identity",
    label: "Identity",
    description:
      "Core account details",
    icon: UserRound
  },
  {
    id: "work",
    label: "Work",
    description:
      "Role and team profile",
    icon: BriefcaseBusiness
  },
  {
    id: "preferences",
    label: "Preferences",
    description:
      "Locale and presence",
    icon: Settings
  },
  {
    id: "security",
    label: "Security",
    description:
      "Recovery and safety",
    icon: Lock
  }
] as const;

type TabId = (typeof tabs)[number]["id"];

const storageKey =
  "profileSettingsDraft";

export default function ProfileSettingsTabs() {
  const user = useAuthStore(
    (state) => state.user
  );
  const updateUser = useAuthStore(
    (state) => state.updateUser
  );

  const [activeTab, setActiveTab] =
    useState<TabId>("identity");
  const [profile, setProfile] =
    useState<ProfileForm>(() => {
      if (typeof window === "undefined") {
        return {
          ...defaultProfile
        };
      }

      try {
        const saved =
          window.localStorage.getItem(
            storageKey
          );

        return {
          ...defaultProfile,
          ...(saved
            ? (JSON.parse(
                saved
              ) as Partial<ProfileForm>)
            : {})
        };
      } catch {
        return {
          ...defaultProfile
        };
      }
    });
  const [savedMessage, setSavedMessage] =
    useState("");

  const profileValues = useMemo(
    () => ({
      ...profile,
      name:
        profile.name ||
        user?.name ||
        "",
      email:
        profile.email ||
        user?.email ||
        ""
    }),
    [profile, user?.email, user?.name]
  );

  const completion = useMemo(
    () => ({
      identity:
        profileValues.name.trim()
          .length > 1 &&
        profileValues.email.includes(
          "@"
        ) &&
        profileValues.phone.trim()
          .length > 6,
      work:
        profileValues.title.trim()
          .length > 1 &&
        profileValues.department.trim()
          .length > 1 &&
        profileValues.company.trim()
          .length > 1 &&
        profileValues.bio.trim()
          .length > 12,
      preferences:
        Boolean(
          profileValues.timezone
        ) &&
        Boolean(
          profileValues.language
        ) &&
        Boolean(profileValues.status),
      security:
        profileValues.recoveryEmail.includes(
          "@"
        )
    }),
    [profileValues]
  );

  const unlockedTabs: Record<TabId, boolean> =
    {
      identity: true,
      work: completion.identity,
      preferences:
        completion.identity &&
        completion.work,
      security:
        completion.identity &&
        completion.work &&
        completion.preferences
    };

  const activeIndex =
    tabs.findIndex(
      (tab) => tab.id === activeTab
    );

  const canContinue =
    completion[activeTab];

  const setField = <
    Key extends keyof ProfileForm
  >(
    key: Key,
    value: ProfileForm[Key]
  ) => {
    setProfile((current) => ({
      ...current,
      [key]: value
    }));
    setSavedMessage("");
  };

  const saveDraft = (
    nextProfile = profileValues
  ) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(nextProfile)
    );
    updateUser({
      name: nextProfile.name,
      email: nextProfile.email
    });
  };

  const goNext = () => {
    if (!canContinue) return;

    saveDraft();

    const next =
      tabs[activeIndex + 1];

    if (next) {
      setActiveTab(next.id);
    } else {
      setSavedMessage(
        "Profile changes saved."
      );
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    goNext();
  };

  return (
    <Card>
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            User profile
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Profile editing workflow
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Complete each section to unlock the next tab and keep profile data structured.
          </p>
        </div>

        <div
          className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
          aria-live="polite"
        >
          Step {activeIndex + 1} of {tabs.length}
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[260px_1fr]">
        <div
          role="tablist"
          aria-label="Profile form sections"
          className="space-y-2"
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive =
              activeTab === tab.id;
            const isUnlocked =
              unlockedTabs[tab.id];
            const isComplete =
              completion[tab.id];

            return (
              <button
                key={tab.id}
                id={`profile-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`profile-panel-${tab.id}`}
                disabled={!isUnlocked}
                onClick={() => {
                  if (isUnlocked) {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isActive
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-white/10"
                      : "bg-slate-100"
                  }`}
                >
                  <Icon
                    size={17}
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {index + 1}. {tab.label}
                  </span>
                  <span
                    className={`block text-xs ${
                      isActive
                        ? "text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    {tab.description}
                  </span>
                </span>
                {isComplete && (
                  <CheckCircle2
                    size={16}
                    aria-label={`${tab.label} complete`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-slate-50 p-4"
        >
          {activeTab === "identity" && (
            <section
              id="profile-panel-identity"
              role="tabpanel"
              aria-labelledby="profile-tab-identity"
              className="space-y-4"
            >
              <TabHeader
                title="Identity details"
                description="Fill all required fields to continue to work profile details."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  id="profile-name"
                  label="Full name"
                  value={profileValues.name}
                  onChange={(value) =>
                    setField("name", value)
                  }
                  required
                />
                <TextField
                  id="profile-email"
                  label="Email address"
                  type="email"
                  value={profileValues.email}
                  onChange={(value) =>
                    setField("email", value)
                  }
                  required
                />
                <TextField
                  id="profile-phone"
                  label="Phone number"
                  type="tel"
                  value={profile.phone}
                  onChange={(value) =>
                    setField("phone", value)
                  }
                  required
                />
              </div>
            </section>
          )}

          {activeTab === "work" && (
            <section
              id="profile-panel-work"
              role="tabpanel"
              aria-labelledby="profile-tab-work"
              className="space-y-4"
            >
              <TabHeader
                title="Work profile"
                description="Add role, department, company, and a short bio before continuing."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  id="profile-title"
                  label="Job title"
                  value={profile.title}
                  onChange={(value) =>
                    setField("title", value)
                  }
                  required
                />
                <TextField
                  id="profile-department"
                  label="Department"
                  value={profile.department}
                  onChange={(value) =>
                    setField(
                      "department",
                      value
                    )
                  }
                  required
                />
                <TextField
                  id="profile-company"
                  label="Company"
                  value={profile.company}
                  onChange={(value) =>
                    setField("company", value)
                  }
                  required
                />
                <label className="text-sm font-medium text-slate-700 md:col-span-2">
                  Bio
                  <textarea
                    value={profile.bio}
                    onChange={(event) =>
                      setField(
                        "bio",
                        event.target.value
                      )
                    }
                    required
                    rows={4}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="A short collaboration-focused profile summary"
                  />
                </label>
              </div>
            </section>
          )}

          {activeTab === "preferences" && (
            <section
              id="profile-panel-preferences"
              role="tabpanel"
              aria-labelledby="profile-tab-preferences"
              className="space-y-4"
            >
              <TabHeader
                title="Workspace preferences"
                description="Choose defaults that help teammates collaborate with you."
              />
              <div className="grid gap-4 md:grid-cols-3">
                <SelectField
                  id="profile-timezone"
                  label="Timezone"
                  value={profile.timezone}
                  onChange={(value) =>
                    setField(
                      "timezone",
                      value
                    )
                  }
                  options={[
                    ["", "Select timezone"],
                    [
                      "Asia/Calcutta",
                      "Asia/Calcutta"
                    ],
                    ["UTC", "UTC"],
                    [
                      "America/New_York",
                      "America/New_York"
                    ],
                    [
                      "Europe/London",
                      "Europe/London"
                    ]
                  ]}
                />
                <SelectField
                  id="profile-language"
                  label="Language"
                  value={profile.language}
                  onChange={(value) =>
                    setField(
                      "language",
                      value
                    )
                  }
                  options={[
                    ["", "Select language"],
                    ["English", "English"],
                    ["Hindi", "Hindi"],
                    ["Spanish", "Spanish"]
                  ]}
                />
                <SelectField
                  id="profile-status"
                  label="Default status"
                  value={profile.status}
                  onChange={(value) =>
                    setField("status", value)
                  }
                  options={[
                    ["", "Select status"],
                    ["Available", "Available"],
                    ["Focus", "Focus"],
                    ["Away", "Away"]
                  ]}
                />
              </div>
            </section>
          )}

          {activeTab === "security" && (
            <section
              id="profile-panel-security"
              role="tabpanel"
              aria-labelledby="profile-tab-security"
              className="space-y-4"
            >
              <TabHeader
                title="Security preferences"
                description="Add a recovery email and choose whether two-factor authentication should be enabled."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  id="profile-recovery-email"
                  label="Recovery email"
                  type="email"
                  value={
                    profile.recoveryEmail
                  }
                  onChange={(value) =>
                    setField(
                      "recoveryEmail",
                      value
                    )
                  }
                  required
                />
                <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700">
                  Enable two-factor authentication
                  <input
                    type="checkbox"
                    checked={profile.twoFactor}
                    onChange={(event) =>
                      setField(
                        "twoFactor",
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  />
                </label>
              </div>
            </section>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="text-sm text-slate-500"
              aria-live="polite"
            >
              {canContinue
                ? "This tab is complete."
                : "Complete all required fields in this tab to continue."}
              {savedMessage
                ? ` ${savedMessage}`
                : ""}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const previous =
                    tabs[activeIndex - 1];

                  if (previous) {
                    setActiveTab(
                      previous.id
                    );
                  }
                }}
                disabled={activeIndex === 0}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canContinue}
                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {activeIndex ===
                tabs.length - 1
                  ? "Save profile"
                  : "Save and continue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}

function TabHeader({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-950">
        {title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="text-sm font-medium text-slate-700"
    >
      {label}
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-slate-900"
      />
    </label>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label
      htmlFor={id}
      className="text-sm font-medium text-slate-700"
    >
      {label}
      <select
        id={id}
        value={value}
        required
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-slate-900"
      >
        {options.map(
          ([optionValue, labelText]) => (
            <option
              key={labelText}
              value={optionValue}
            >
              {labelText}
            </option>
          )
        )}
      </select>
    </label>
  );
}
