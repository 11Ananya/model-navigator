import { useState, useMemo } from "react";
import { ChevronDown, Zap, AlertTriangle, Check, Info } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  taskTypes,
  gpuMemoryOptions,
  inferenceDevices,
  licenseTypes,
  getRecommendations,
  type DemoConfig,
  type ModelRecommendation,
} from "@/data/modelData";

export function DemoInterface() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const [config, setConfig] = useState<DemoConfig>({
    taskType: "text-generation",
    gpuMemory: "16gb",
    inferenceDevice: "consumer-gpu",
    maxLatency: 100,
    licenseType: "any",
  });

  const recommendations = useMemo(() => getRecommendations(config), [config]);

  return (
    <section id="demo" className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div 
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto text-center mb-12 scroll-fade-up",
            isVisible && "visible"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Decision Preview
          </h2>
          <p className="text-lg text-muted-foreground">
            Illustrative example using curated model metadata
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-2">
              <InputPanel config={config} setConfig={setConfig} />
            </div>

            {/* Output Panel */}
            <div className="lg:col-span-3">
              <OutputPanel recommendations={recommendations} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputPanel({
  config,
  setConfig,
}: {
  config: DemoConfig;
  setConfig: React.Dispatch<React.SetStateAction<DemoConfig>>;
}) {
  return (
    <div className="card-glass-lg p-6 space-y-6 sticky top-24 glow-intense">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center animate-glow-pulse">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold">Configure Constraints</h3>
      </div>

      {/* Task Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Task Type
        </label>
        <Select
          value={config.taskType}
          onValueChange={(value) => setConfig((prev) => ({ ...prev, taskType: value }))}
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {taskTypes.map((task) => (
              <SelectItem key={task.value} value={task.value} className="rounded-lg">
                {task.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* GPU Memory */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          GPU Memory
        </label>
        <Select
          value={config.gpuMemory}
          onValueChange={(value) => setConfig((prev) => ({ ...prev, gpuMemory: value }))}
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {gpuMemoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="rounded-lg">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inference Device */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Inference Device
        </label>
        <Select
          value={config.inferenceDevice}
          onValueChange={(value) => setConfig((prev) => ({ ...prev, inferenceDevice: value }))}
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {inferenceDevices.map((device) => (
              <SelectItem key={device.value} value={device.value} className="rounded-lg">
                {device.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Latency Requirement */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">
            Max Latency
          </label>
          <span className="text-sm font-mono text-foreground">
            {config.maxLatency}ms
          </span>
        </div>
        <Slider
          value={[config.maxLatency]}
          onValueChange={([value]) => setConfig((prev) => ({ ...prev, maxLatency: value }))}
          min={20}
          max={500}
          step={10}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>20ms</span>
          <span>500ms</span>
        </div>
      </div>

      {/* License Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          License Requirements
        </label>
        <Select
          value={config.licenseType}
          onValueChange={(value) => setConfig((prev) => ({ ...prev, licenseType: value }))}
        >
          <SelectTrigger className="rounded-xl bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border rounded-xl">
            {licenseTypes.map((license) => (
              <SelectItem key={license.value} value={license.value} className="rounded-lg">
                {license.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function OutputPanel({
  recommendations,
}: {
  recommendations: ReturnType<typeof getRecommendations>;
}) {
  return (
    <div className="space-y-4">
      {/* Primary Recommendation */}
      <ModelCard model={recommendations.primary} isPrimary />

      {/* Alternatives */}
      <div className="grid sm:grid-cols-2 gap-4">
        {recommendations.alternatives.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {/* Warning Card */}
      <WarningCard model={recommendations.warning} />
    </div>
  );
}

function ModelCard({
  model,
  isPrimary = false,
}: {
  model: ModelRecommendation;
  isPrimary?: boolean;
}) {
  const [expanded, setExpanded] = useState(isPrimary);

  return (
    <div
      className={cn(
        "card-glass hover-lift-3d overflow-hidden transition-all duration-300",
        isPrimary && "ring-2 ring-primary/30 glow-intense"
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            {isPrimary && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary mb-2">
                <Check className="w-3 h-3" />
                Primary Recommendation
              </span>
            )}
            <h4 className="font-semibold">{model.name}</h4>
            <p className="text-sm text-muted-foreground">{model.provider}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{model.score}</div>
            <div className="text-xs text-muted-foreground">score</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Stat label="Params" value={model.parameters} />
          <Stat label="Memory" value={model.memoryRequired} />
          <Stat label="Latency" value={model.latency} />
          <Stat label="License" value={model.license.split(" ")[0]} />
        </div>

        {/* Reasoning */}
        <p className="text-sm text-muted-foreground mb-3">{model.reasoning}</p>

        {/* Tradeoffs Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-muted-foreground hover:text-foreground rounded-xl"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Tradeoffs</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </Button>

        {/* Tradeoffs Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "max-h-40 mt-3" : "max-h-0"
          )}
        >
          <ul className="space-y-1.5">
            {model.tradeoffs.map((tradeoff, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                {tradeoff}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-secondary/50">
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-xs font-medium truncate">{value}</div>
    </div>
  );
}

function WarningCard({ model }: { model: ModelRecommendation }) {
  return (
    <div className="card-glass border-destructive/30 bg-destructive/5 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-destructive">Avoid</h4>
              <span className="text-sm text-muted-foreground">
                {model.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {model.reasoning}
            </p>
            <div className="flex flex-wrap gap-2">
              {model.tradeoffs.map((issue, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-destructive/10 text-xs text-destructive/80"
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
