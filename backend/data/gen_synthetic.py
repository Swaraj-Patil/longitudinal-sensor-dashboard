import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os

def generate_subject_data(subject_id: str,
                          source: str,
                          start_time: datetime,
                          duration_hours: float,
                          sampling_interval_secs: float = 1.0,
                          include_xyz: bool = True,
                          include_value: bool = False,
                          noise_std: float = 0.1) -> pd.DataFrame:
    """
    Generate synthetic time-series for one subject.
    Columns:
      - timestamp: UTC ISO format
      - subject_id: string
      - source: string
      - (x, y, z): if include_xyz
      - value: if include_value
    """
    num_samples = int(duration_hours * 3600 / sampling_interval_secs)
    timestamps = [start_time + timedelta(seconds=i * sampling_interval_secs)
                  for i in range(num_samples)]
    
    # simulate base signal: e.g., circadian cycle + random noise
    # For example activity magnitude varying as sine wave over the day
    # normalized to [0, 1]
    t_seconds = np.arange(num_samples) * sampling_interval_secs
    # daily cycle: period = 24h -> in seconds = 24 * 3600
    daily_period = 24 * 3600
    base_activity = (np.sin(2 * np.pi * (t_seconds % daily_period) / daily_period) + 1) / 2  # between 0 and 1

    # simulate xyz or value
    data = {
        'timestamp': timestamps,
        'subject_id': [subject_id] * num_samples,
        'source': [source] * num_samples,
    }

    if include_xyz:
        # simulate x, y, z with base_activity + random noise
        data['x'] = base_activity + np.random.normal(0, noise_std, size=num_samples)
        data['y'] = base_activity + np.random.normal(0, noise_std, size=num_samples)
        data['z'] = base_activity + np.random.normal(0, noise_std, size=num_samples)
    if include_value:
        # maybe simulate a different metric e.g. phone usage minutes/spread
        # For value, simulate bursts (phone usage) randomly
        # We'll simulate "phone screen minutes per sampling interval"
        # e.g., mostly zero, occasionally a spike
        usage = np.random.choice([0.0, 1.0], size=num_samples, p=[0.95, 0.05])
        data['value'] = usage * (np.random.uniform(0.5, 2.0, size=num_samples))  # random usage
    # optional label column
    # e.g., if base_activity > threshold => "active" else "rest"
    data['label'] = ['active' if (include_xyz and (abs(x)>0.5 or abs(y)>0.5 or abs(z)>0.5)) \
                     else 'rest' for x, y, z in zip(
                         data.get('x', [0]*num_samples),
                         data.get('y', [0]*num_samples),
                         data.get('z', [0]*num_samples),
                     )] if include_xyz else ['rest'] * num_samples

    df = pd.DataFrame(data)
    return df

def write_csv(df: pd.DataFrame, out_path: str):
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    df.to_csv(out_path, index=False)
    print(f"Wrote {len(df)} rows to {out_path}")

def main():
    # parameters you can tweak
    subject_id = "subject_1"
    source = "accelerometer"
    start_time = datetime.utcnow().replace(microsecond=0)
    duration_hours = 1.0   # 1 hour of data
    sampling_interval_secs = 1.0  # one sample per second
    include_xyz = True
    include_value = True
    noise_std = 0.1

    df = generate_subject_data(subject_id, source, start_time, duration_hours,
                               sampling_interval_secs, include_xyz, include_value, noise_std)

    out_path = "data/synthetic_subject1_accel.csv"
    write_csv(df, out_path)

    # also generate for another subject / source if you like
    df2 = generate_subject_data("subject_2", "phone_usage", start_time, duration_hours,
                                sampling_interval_secs=60.0, include_xyz=False, include_value=True, noise_std=0.0)
    out_path2 = "data/synthetic_subject2_phone.csv"
    write_csv(df2, out_path2)

if __name__ == "__main__":
    main()
