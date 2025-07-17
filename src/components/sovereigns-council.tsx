
'use client';

import type { SovereignsCouncilResult, AgentPerspective } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Check, AlertTriangle, ScrollText } from 'lucide-react';
import {
  StrategistSigil,
  CynicSigil,
  EconomistSigil,
  MarketerSigil,
  BuilderSigil,
} from './sigils';
import { cn } from '@/lib/utils';

interface SovereignsCouncilProps {
  data: SovereignsCouncilResult;
}

const AGENT_DETAILS: Record<
  AgentPerspective['agent'],
  { sigil: React.ElementType; title: string; color: string }
> = {
  Strategist: { sigil: StrategistSigil, title: 'The Strategist (Athena)', color: 'text-blue-400' },
  Cynic: { sigil: CynicSigil, title: 'The Cynic (Diogenes)', color: 'text-amber-400' },
  Economist: { sigil: EconomistSigil, title: 'The Economist (Plutus)', color: 'text-green-400' },
  Marketer: { sigil: MarketerSigil, title: 'The Marketer (Aphrodite)', color: 'text-pink-400' },
  Builder: { sigil: BuilderSigil, title: 'The Builder (Hephaestus)', color: 'text-orange-400' },
};

function PerspectiveCard({ perspective }: { perspective: AgentPerspective }) {
  const details = AGENT_DETAILS[perspective.agent];
  return (
    <div className="p-4 rounded-lg border border-border/50 transition-colors duration-200">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-4 text-left">
              <div className={cn('w-8 h-8 shrink-0', details.color)}>
                <details.sigil />
              </div>
              <h4 className="font-headline text-lg text-foreground transition-colors duration-200">
                {details.title}
              </h4>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 pl-12">
            <p className="text-muted-foreground mb-4">{perspective.perspective}</p>
            {perspective.opportunities.length > 0 && (
              <div className="mb-3">
                <h5 className="font-bold text-sm text-secondary mb-2">Opportunities</h5>
                <ul className="space-y-1 list-none">
                  {perspective.opportunities.map((opp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {perspective.risks.length > 0 && (
              <div>
                <h5 className="font-bold text-sm text-destructive mb-2">Risks</h5>
                 <ul className="space-y-1 list-none">
                  {perspective.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                       <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/**
 * Renders the full "Conclave Chamber" UI for the Sovereign's Council.
 * This component visualizes the multi-agent debate, presenting each agent's
 * perspective in a structured and digestible format, culminating in the
 * final "Scroll of Verdict".
 * @param {SovereignsCouncilProps} props The props for the component.
 * @returns {JSX.Element} The rendered council results component.
 */
export function SovereignsCouncil({ data }: SovereignsCouncilProps) {
  const { idea, perspectives, verdict } = data;

  const handleArchive = () => {
    // In a real application, this would call a server action to persist the verdict.
    console.log('Archiving verdict to the Pillar of Eternity...');
  };

  return (
    <Card className="bg-transparent border-0 shadow-none w-full max-w-sm md:max-w-lg lg:max-w-4xl">
      <CardHeader className="text-center pt-5 px-5">
        <CardTitle className="text-2xl font-headline text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
          The Sovereign's Council is Convened
        </CardTitle>
        <CardDescription>An analysis of the idea:</CardDescription>
        <p className="text-lg text-foreground font-bold pt-2">&quot;{idea}&quot;</p>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4 mb-8">
          {perspectives.map((p) => (
            <PerspectiveCard key={p.agent} perspective={p} />
          ))}
        </div>
        
        <div className="p-6 rounded-lg glassmorphism border-2 border-primary/50 shadow-2xl shadow-primary/20">
            <div className="flex items-center gap-4 mb-4">
                <ScrollText className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-headline text-primary">The Scroll of Verdict</h3>
            </div>
            <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground">
                <p>{verdict.summary}</p>
                <h4>Recommended Actions:</h4>
                <ul>
                    {verdict.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                    ))}
                </ul>
            </div>
             <div className="mt-6 flex justify-center">
                <Button onClick={handleArchive}>
                    Carve this Verdict onto the Pillar
                </Button>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
