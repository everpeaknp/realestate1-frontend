import { Users, TrendingUp, Home, MessageSquare, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const stats = [
    { title: 'Total Leads', value: '124', icon: Users, change: '+12%', isUp: true },
    { title: 'New Today', value: '8', icon: TrendingUp, change: '+2', isUp: true },
    { title: 'Top Property Views', value: '450', icon: Home, change: '-4%', isUp: false },
    { title: 'Chat Conversion', value: '18%', icon: MessageSquare, change: '+1%', isUp: true },
  ];

  const recentLeads = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', source: 'Contact Form', type: 'Buy', status: 'New' },
    { id: 2, name: 'Bob Smith', email: 'bob@smith.com', source: 'Chatbot', type: 'Question', status: 'Contacted' },
    { id: 3, name: 'Charlie Davis', email: 'charlie@gmail.com', source: 'Valuation Form', type: 'Sell', status: 'New' },
    { id: 4, name: 'Diana Prince', email: 'diana@amazon.net', source: 'Property Page', type: 'Buy', status: 'Qualified' },
  ];

  return (
    <>
      <Header />
      
      <main className="container section">
        <div className={styles.header}>
            <h1>Agent Dashboard</h1>
            <p>Welcome back! Here is what's happening with your leads.</p>
        </div>

        <div className={styles.statsGrid}>
            {stats.map((s, i) => (
                <div key={i} className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statIcon}><s.icon size={20} /></div>
                        <div className={`${styles.change} ${s.isUp ? styles.up : styles.down}`}>
                            {s.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.change}
                        </div>
                    </div>
                    <div className={styles.statValue}>{s.value}</div>
                    <div className={styles.statTitle}>{s.title}</div>
                </div>
            ))}
        </div>

        <div className={styles.contentLayout}>
            <div className={styles.leadsSection}>
                <h3>Recent Leads</h3>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Source</th>
                                <th>Interest</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td><strong>{lead.name}</strong></td>
                                    <td>{lead.email}</td>
                                    <td><span className={styles.tag}>{lead.source}</span></td>
                                    <td>{lead.type}</td>
                                    <td>
                                        <span className={`${styles.status} ${styles[lead.status.toLowerCase()]}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <aside className={styles.sourceChart}>
                <h3>Lead Sources</h3>
                <div className={styles.chartPlaceholder}>
                    {/* Simplified visual representation */}
                    <div className={styles.chartBar} style={{ height: '80%', background: 'var(--color-surface-muted)' }}><span>60% Web</span></div>
                    <div className={styles.chartBar} style={{ height: '30%', background: 'var(--color-accent)' }}><span>25% Chat</span></div>
                    <div className={styles.chartBar} style={{ height: '15%', background: '#545454' }}><span>15% Other</span></div>
                </div>
            </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
