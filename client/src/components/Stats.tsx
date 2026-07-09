import React, { useState, useEffect, useRef } from 'react';
import { Users, Download, Star, Layers } from 'lucide-react';

const AnimatedCounter = ({ value, suffix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * value);

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, value, duration]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
  };

  return (
    <div ref={ref} className="count-animation">
      {typeof count === 'number' && !isNaN(count)
        ? (Number.isInteger(value) ? formatNumber(count) : count.toFixed(1))
        : '--'}
      {suffix}
    </div>
  );
};

const Stats = ({ stats: customStats }) => {
  const [stats, setStats] = useState(
    customStats || [
      {
        icon: Layers,
        value: 36,
        suffix: '+',
        label: 'Code Templates',
      },
      {
        icon: Download,
        value: 68,
        suffix: '+',
        label: 'Downloads',
      },
      {
        icon: Star,
        value: 3.9,
        suffix: '/5',
        label: 'Average Rating',
      },
    ]
  );

  return (
    <section className="pt-4 pb-12 bg-[#000000]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="border border-[#222222] bg-[#000000] p-8 sm:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center sm:text-left sm:flex sm:items-center sm:gap-4 ${index < stats.length - 1 ? 'sm:border-r sm:border-[#222222] sm:pr-12' : ''}`}>
                <div className="flex justify-center sm:justify-start mb-4 sm:mb-0">
                  <stat.icon className="w-8 h-8 text-foreground/40" />
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      duration={2000 + index * 200}
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/40 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
