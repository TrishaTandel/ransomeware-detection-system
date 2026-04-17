import pandas as pd
from pathlib import Path

RAW_PATH = Path("data/raw/ransomware.csv")
PROCESSED_PATH = Path("data/processed/processed.csv")


def load_dataset():
    print("Loading dataset...")

    df = pd.read_csv(RAW_PATH)

    # remove missing values
    df = df.dropna()

    # convert label column
    if "Class" in df.columns:
        df["Class"] = df["Class"].map(
            {"Benign": 0, "Ransomware": 1}
        )

    df.to_csv(PROCESSED_PATH, index=False)

    print("Dataset processed and saved.")
    return df


if __name__ == "__main__":
    load_dataset()