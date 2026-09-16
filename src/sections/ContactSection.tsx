import React, { useState } from 'react';
import { OptionWheel } from '../components/OptionWheel';
import { CinematicSplitText } from '../components/CinematicSplitText';
import { SignalSplitText } from '../components/SignalSplitText';

const CONTACT_CHANNELS = [
  {
    label: 'EMAIL',
    detail: 'subhashishbudati9976@gmail.com',
    action: 'SEND MESSAGE',
    href: 'mailto:subhashishbudati9976@gmail.com',
  },
  {
    label: 'LINKEDIN',
    detail: 'PROFILE',
    action: 'OPEN PROFILE',
    href: 'https://www.linkedin.com/in/subhashish-budati-685664427',
  },
  {
    label: 'GITHUB',
    detail: 'REPOSITORIES',
    action: 'VIEW GITHUB',
    href: 'https://github.com/subhashishbudati9976-creator',
  },
];

export const ContactSection: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState(0);
  const activeChannel = CONTACT_CHANNELS[selectedChannel];

  return (
    <section
      id="contact"
      className="signal-section page-container"
      aria-labelledby="contact-heading"
    >
      <div className="signal-layout">
        <div className="signal-intro motion-reveal" data-motion-reveal="fade-up">
          <div className="stage-chapter-marker signal-chapter">
            <span className="stage-chapter-num"><CinematicSplitText lines={['CHAPTER 05']} splitType="words" /></span>
          </div>
          <p className="signal-kicker"><CinematicSplitText lines={['THE SIGNAL']} splitType="words" /></p>
          <h2 className="signal-title" id="contact-heading">
            <SignalSplitText />
          </h2>
          <p className="signal-supporting">
            Have an idea, a project, or an opportunity worth exploring? Let&apos;s connect.
          </p>
        </div>

        <div className="signal-interface motion-reveal" data-motion-reveal="fade-up">
          <div className="signal-interface-heading">
            <span>CONTACT // SIGNAL CONSOLE</span>
            <span className="signal-ready-label"><i aria-hidden="true" />STATUS // READY</span>
          </div>

          <div className="signal-console-meta">
            <span>SIGNAL CHANNEL // 03</span>
            <span>SELECT CHANNEL</span>
          </div>

          <div className="signal-console-body">
            <div className="contact-option-wheel">
              <OptionWheel
                items={CONTACT_CHANNELS.map(channel => channel.label)}
                defaultSelected={0}
                textColor="#777777"
                activeColor="#ffffff"
                side="left"
                fontSize={1.6}
                spacing={1.05}
                curve={1}
                tilt={7}
                blur={1.8}
                fade={0.24}
                minOpacity={0.08}
                smoothing={170}
                inset={30}
                loop
                draggable
                soundUrl=""
                wheelEnabled
                onChange={index => setSelectedChannel(index)}
              />
            </div>

            <div className="signal-selected-channel">
              <span className="signal-selected-label">{activeChannel.label}</span>
              <span className="signal-selected-rule" aria-hidden="true" />
              <strong>{activeChannel.detail}</strong>
              <a
                href={activeChannel.href}
                className="signal-selected-action"
                target={activeChannel.label === 'EMAIL' ? undefined : '_blank'}
                rel={activeChannel.label === 'EMAIL' ? undefined : 'noopener noreferrer'}
              >
                {activeChannel.action} ↗
              </a>
            </div>
          </div>
        </div>

        <div className="signal-action-zone motion-reveal" data-motion-reveal="fade-up">
          <a className="signal-primary-cta" href="mailto:subhashishbudati9976@gmail.com">
            <span>START A CONVERSATION</span>
            <span aria-hidden="true">↗</span>
          </a>
          <div className="signal-ai-hook" aria-label="Subu AI visual hook">
            <span>CURIOUS?</span>
            <span>ASK SUBU AI ↗</span>
          </div>
        </div>

        <div className="signal-signature motion-reveal" data-motion-reveal="fade-up">
          <strong>SUBHASHISH BUDATI</strong>
          <span>CSE · AI APPLICATIONS · SOFTWARE ENGINEERING</span>
          <span className="signal-signature-motto">BUILD. LEARN. EVOLVE.</span>
        </div>
      </div>

      <div className="signal-system motion-reveal" data-motion-reveal="fade-up">
        <span className="signal-system-line" aria-hidden="true" />
        <span>SYSTEM // JOURNEY COMPLETE</span>
        <span className="signal-ready"><i aria-hidden="true" />SIGNAL READY</span>
      </div>
    </section>
  );
};
